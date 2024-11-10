package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"syscall"
	"time"
)

// Main function to start both servers
func main() {
	http.HandleFunc("/handshake_timeout", handshakeTimeoutHandler)
	http.HandleFunc("/connection_reset", connectionResetHandler)
	http.HandleFunc("/eof", eofHandler)
	go startHTTPServer()
	go startHTTPSServer()
	go startTCPServer()

	select {} // Keep the main function running
}

// Start the HTTP server
func startHTTPServer() {
	fmt.Println("Starting HTTP server on :6666")
	if err := http.ListenAndServe(":6666", nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

// Start the HTTPS server
func startHTTPSServer() {
	wd, err := os.Getwd()
	if err != nil {
		log.Fatalf("Error getting current working directory: %v", err)
	}

	certPath := filepath.Join(wd, "certs", "cert.pem")
	keyPath := filepath.Join(wd, "certs", "key.pem")

	fmt.Println("Starting HTTPS server on :6443")
	if err := http.ListenAndServeTLS(":6443", certPath, keyPath, nil); err != nil {
		log.Fatalf("HTTPS Server failed to start: %v", err)
	}
}

// Start the TCP server that simulates SYN-ACK without completing the handshake
func startTCPServer() {
	fmt.Println("Starting TCP server on :6665")
	listener, err := net.Listen("tcp", ":6665")
	if err != nil {
		log.Fatalf("Failed to start TCP server: %v", err)
	}
	defer listener.Close()

	for {
		conn, err := listener.Accept()
		if err != nil {
			log.Printf("Failed to accept connection: %v", err)
			continue
		}
		go handleConnection(conn)
	}
}

// Simulate handshake timeout by introducing a delay without responding
func handshakeTimeoutHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Simulating handshake timeout...")
	time.Sleep(30 * time.Second)
}

// connectionResetHandler handles incoming HTTP requests to the /connection_reset endpoint
// and simulates a connection reset by peer using TCP RST.
//
// Step-by-step explanation:
// 1. Log a message indicating the start of the simulation.
// 2. Attempt to hijack the connection to access the underlying net.Conn.
//   - If hijacking is not supported, return an error response.
//
// 3. Obtain the hijacked connection.
//   - If an error occurs, return an error response.
//
// 4. Check if the hijacked connection is of type *net.TCPConn.
//   - If not, log an error message and exit the function.
//
// 5. Retrieve the file descriptor associated with the TCP connection.
//   - Use the File() method to get the file descriptor for the socket.
//   - Close the file descriptor at the end of the function to prevent resource leaks.
//
// 6. Set the SO_LINGER socket option to control how the socket behaves on close.
//   - Enable the linger option with Onoff set to 1.
//   - Set Linger to 0 to force an immediate TCP RST when closing the connection.
//
// 7. Close the connection, which triggers the TCP RST due to the SO_LINGER settings.
// 8. Log a message indicating that the TCP RST has been simulated and the connection is closed.
func connectionResetHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Simulating connection reset by peer with TCP RST...")

	// Hijack the connection to get the underlying net.Conn
	hj, ok := w.(http.Hijacker)
	if !ok {
		http.Error(w, "Server does not support hijacking", http.StatusInternalServerError)
		return
	}
	conn, _, err := hj.Hijack()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Cast the connection to *net.TCPConn to access the underlying file descriptor
	tcpConn, ok := conn.(*net.TCPConn)
	if !ok {
		fmt.Println("Error: Not a TCP connection")
		return
	}

	// Retrieve the file descriptor of the connection
	file, err := tcpConn.File()
	if err != nil {
		fmt.Println("Failed to get file descriptor:", err)
		return
	}
	defer file.Close()
	// net.Error

	// Set SO_LINGER with a timeout of 0 to force an immediate RST
	syscall.SetsockoptLinger(int(file.Fd()), syscall.SOL_SOCKET, syscall.SO_LINGER, &syscall.Linger{
		Onoff:  1, // Enable linger option
		Linger: 0, // Linger timeout of 0 seconds to immediately reset the connection
	})

	// Close the connection, which will now result in an RST due to SO_LINGER settings
	conn.Close()
	fmt.Println("TCP RST simulated and connection closed.")
}

// Handle the incoming connection, simulating SYN-ACK and then closing without completing handshake
func handleConnection(conn net.Conn) {
	defer conn.Close()
	fmt.Println("Accepted connection, simulating SYN-ACK without completing handshake...")

	// Simulate sending SYN-ACK (this is a theoretical simulation)
	// In reality, once we accept the connection, TCP has completed the handshake.
	// We can wait here to simulate the server being unresponsive.
	time.Sleep(10 * time.Second) // Simulate delay

	// After the delay, we just close the connection to simulate a reset.
	// No ACK is sent by the client because the server does not respond.
	fmt.Println("Closing connection without sending ACK...")
}

// Simulate EOF by writing part of the response and then closing the connection
func eofHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Simulating EOF...")
	hj, ok := w.(http.Hijacker)
	if !ok {
		http.Error(w, "Server does not support hijacking", http.StatusInternalServerError)
		return
	}
	conn, _, err := hj.Hijack()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer conn.Close()
	// conn.Write([]byte("Partial response, then EOF"))
	fmt.Println("EOF simulated by server")
}
