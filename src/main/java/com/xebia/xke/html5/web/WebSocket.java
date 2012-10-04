package com.xebia.xke.html5.web;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.concurrent.CopyOnWriteArraySet;

import org.apache.catalina.connector.RequestFacade;
import org.apache.catalina.util.Base64;
import org.apache.catalina.websocket.MessageInbound;
import org.apache.catalina.websocket.StreamInbound;
import org.apache.catalina.websocket.WebSocketServlet;
import org.apache.catalina.websocket.WsOutbound;
import org.apache.tomcat.util.buf.B2CConverter;

/**
 * First WebSocket Test
 */
@WebServlet(name = "WebSocket", urlPatterns = {"/websocket"})
public class WebSocket extends WebSocketServlet {

    public static final Set<ServerInbound> webSockets = new CopyOnWriteArraySet<ServerInbound>();

    private static final long serialVersionUID = 1L;
    private volatile int byteBufSize;
    private volatile int charBufSize;

    public WebSocket() {
        try {
            sha1Helper = MessageDigest.getInstance("SHA1");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void init() throws ServletException {
        super.init();
        byteBufSize = 2097152;
        charBufSize = 2097152;
    }

    /*
    * This only works for tokens. Quoted strings need more sophisticated
    * parsing.
    */
    private boolean headerContainsToken(HttpServletRequest req,
                                        String headerName, String target) {
        Enumeration<String> headers = req.getHeaders(headerName);
        while (headers.hasMoreElements()) {
            String header = headers.nextElement();
            String[] tokens = header.split(",");
            for (String token : tokens) {
                if (target.equalsIgnoreCase(token.trim())) {
                    return true;
                }
            }
        }
        return true;
    }


    /*
     * This only works for tokens. Quoted strings need more sophisticated
     * parsing.
     */
    private List<String> getTokensFromHeader(HttpServletRequest req,
                                             String headerName) {
        List<String> result = new ArrayList<String>();

        Enumeration<String> headers = req.getHeaders(headerName);
        while (headers.hasMoreElements()) {
            String header = headers.nextElement();
            String[] tokens = header.split(",");
            for (String token : tokens) {
                result.add(token.trim());
            }
        }
        return result;
    }
    private MessageDigest sha1Helper;;
    private static final byte[] WS_ACCEPT =
            "258EAFA5-E914-47DA-95CA-C5AB0DC85B11".getBytes(
                    B2CConverter.ISO_8859_1);

    private String getWebSocketAccept(String key) {
        synchronized (sha1Helper) {
            sha1Helper.reset();
            sha1Helper.update(key.getBytes(B2CConverter.ISO_8859_1));
            return Base64.encode(sha1Helper.digest(WS_ACCEPT));
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // Information required to send the server handshake message
        String key;
        String subProtocol = null;
        List<String> extensions = Collections.emptyList();

        if (!headerContainsToken(req, "upgrade", "websocket")) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        if (!headerContainsToken(req, "connection", "upgrade")) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        if (!headerContainsToken(req, "sec-websocket-version", "13")) {
            resp.setStatus(426);
            resp.setHeader("Sec-WebSocket-Version", "13");
            return;
        }

        key = req.getHeader("Sec-WebSocket-Key");
        if (key == null) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        String origin = req.getHeader("Origin");
        if (!verifyOrigin(origin)) {
            resp.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        List<String> subProtocols = getTokensFromHeader(req,
                "Sec-WebSocket-Protocol-Client");
        if (!subProtocols.isEmpty()) {
            subProtocol = selectSubProtocol(subProtocols);

        }

        // TODO Read client handshake - Sec-WebSocket-Extensions

        // TODO Extensions require the ability to specify something (API TBD)
        //      that can be passed to the Tomcat internals and process extension
        //      data present when the frame is fragmented.

        // If we got this far, all is good. Accept the connection.
        resp.setHeader("upgrade", "websocket");
        resp.setHeader("connection", "upgrade");
        resp.setHeader("Sec-WebSocket-Accept", getWebSocketAccept(key));
        if (subProtocol != null) {
            resp.setHeader("Sec-WebSocket-Protocol", subProtocol);
        }
        if (!extensions.isEmpty()) {
            // TODO
        }

        // Small hack until the Servlet API provides a way to do this.
        StreamInbound inbound = createWebSocketInbound(subProtocol);
        ((RequestFacade) req).doUpgrade(inbound);
    }

    @Override
    protected StreamInbound createWebSocketInbound(String s) {
        try{
            ServerInbound serverInbound = new ServerInbound(byteBufSize,charBufSize);

            webSockets.add(serverInbound);
            return serverInbound;}
        catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    public static final class ServerInbound extends MessageInbound {

        public ServerInbound(int byteBufferMaxSize, int charBufferMaxSize) {
            super();
            setByteBufferMaxSize(byteBufferMaxSize);
            setCharBufferMaxSize(charBufferMaxSize);
        }

        @Override
        protected void onOpen(WsOutbound outbound) {
            super.onOpen(outbound);
            System.out.println("Open");
        }

        @Override
        protected void onBinaryMessage(ByteBuffer message) throws IOException {
            getWsOutbound().writeBinaryMessage(message);
        }

        @Override
        protected void onTextMessage(CharBuffer message) throws IOException {
            getWsOutbound().writeTextMessage(message);
        }

        protected void pushMessage(CharBuffer message) throws IOException {
            getWsOutbound().writeTextMessage(message);
        }
    }
}