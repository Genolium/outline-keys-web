package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"strings"
	"time"

	"github.com/Jigsaw-Code/outline-sdk/dns"
	"github.com/Jigsaw-Code/outline-sdk/transport"
	"github.com/Jigsaw-Code/outline-sdk/x/config"
	"github.com/Jigsaw-Code/outline-sdk/x/connectivity"
)

type connectionResponse struct {
	Error    string `json:"error"`
	MaxDelay int64  `json:"max_delay"`
}

func checkConnection(w http.ResponseWriter, r *http.Request) {
	transportFlag := r.URL.Query().Get("transport")
	if transportFlag == "" {
		http.Error(w, "Missing 'transport' parameter", http.StatusBadRequest)
		return
	}

	err, maxDelay := CheckConnection(transportFlag)
	response := connectionResponse{
		Error:    "",
		MaxDelay: maxDelay,
	}
	if err != nil {
		response.Error = err.Error()
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

//export CheckConnection
func CheckConnection(transportFlag string) (error, int64) {
	log.Println("CheckConnection called with transport: ", transportFlag)

	resolverFlag := "8.8.8.8,2001:4860:4860::8888"
	protoFlag := "tcp"
	var maxDelay int64 = 0

	configParser := config.NewDefaultConfigParser()
	for _, resolverHost := range strings.Split(resolverFlag, ",") {
		resolverAddress := net.JoinHostPort(strings.TrimSpace(resolverHost), "53")
		for _, proto := range strings.Split(protoFlag, ",") {
			proto = strings.TrimSpace(proto)
			log.Println("Checking connectivity with proto: ", proto, " and resolver: ", resolverAddress)
			var resolver dns.Resolver
			switch proto {
			case "tcp":
				streamDialer, err := configParser.WrapStreamDialer(&transport.TCPDialer{}, transportFlag)
				if err != nil {
					log.Println("Error wrapping stream dialer: ", err)
					return err, 0
				}
				resolver = dns.NewTCPResolver(streamDialer, resolverAddress)
			case "udp":
				packetDialer, err := configParser.WrapPacketDialer(&transport.UDPDialer{}, transportFlag)
				if err != nil {
					log.Println("Error wrapping packet dialer: ", err)
					return err, 0
				}
				resolver = dns.NewUDPResolver(packetDialer, resolverAddress)
			}
			startTime := time.Now()
			result, err := connectivity.TestConnectivityWithResolver(context.Background(), resolver, "https://www.wikipedia.org/")
			testDuration := time.Since(startTime)
			if testDuration.Milliseconds() > maxDelay {
				maxDelay = testDuration.Milliseconds()
			}
			if err != nil {
				log.Println("Error testing connectivity with resolver: ", err)
				return err, maxDelay
			}
			if result != nil {
				log.Println("Connectivity test failed with result: ", result)
				return fmt.Errorf("ошибка"), maxDelay
			}
			log.Println("Connectivity test successful with result: ", result)
		}
		log.Println("Connectivity test successful with max delay: ", maxDelay)
	}

	return nil, maxDelay
}

func main() {
	http.HandleFunc("/check-connection", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request at /check-connection")
		checkConnection(w, r)
	})
	fmt.Println("Starting server on :8080")
	log.Println("Server starting on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
	log.Println("Server started on :8080")
}
