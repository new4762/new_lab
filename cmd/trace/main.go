package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httptrace"
)

func main() {
	http.HandleFunc("/test", MakeHttpCall)
	// http.HandleFunc("/echo", handleEcho)
	http.ListenAndServe(":4701", nil)
}

// func handleEcho(w http.ResponseWriter, req *http.Request) {
// 	// Write "Status OK" as the response
// 	w.WriteHeader(http.StatusOK)
// 	io.WriteString(w, "Status OK")
// }

// MakeHttpCall is an example of making a http request, while logging any DNS info
// received and if the connection was established afresh, or re-used.
func MakeHttpCall(w http.ResponseWriter, _ *http.Request) {

	req, err := http.NewRequest(http.MethodGet, "http://localhost:5672/echo", nil)
	if err != nil {
		log.Fatal(err)
	}

	clientTrace := &httptrace.ClientTrace{
		GotConn: func(info httptrace.GotConnInfo) {
			if info.Reused {
				fmt.Printf("Connection was reused: %t \n", info.Reused)
				fmt.Printf("Conn Info: %+v \n", info.Conn)
			}

		},
		// DNSDone: func(dnsInfo httptrace.DNSDoneInfo) {
		// 	fmt.Printf("DNS Info: %+v \n", dnsInfo)
		// },
	}

	req = req.WithContext(httptrace.WithClientTrace(req.Context(), clientTrace))
	_, err = http.DefaultTransport.RoundTrip(req)
	if err != nil {
		log.Fatal(err)
	}
}
