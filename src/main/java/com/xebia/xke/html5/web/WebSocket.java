package com.xebia.xke.html5.web;

import javax.servlet.annotation.WebServlet;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;

import org.apache.catalina.websocket.MessageInbound;
import org.apache.catalina.websocket.StreamInbound;
import org.apache.catalina.websocket.WebSocketServlet;

/**
 * First WebSocket Test
 */
@WebServlet(name = "WebSocket", urlPatterns = {"/websocket"})
public class WebSocket extends WebSocketServlet {

    @Override
    protected StreamInbound createWebSocketInbound(String s) {
        return new MessageInbound() {
            @Override
            protected void onBinaryMessage(ByteBuffer byteBuffer) throws IOException {
                throw new UnsupportedOperationException("Not implemented yet !");
            }

            @Override
            protected void onTextMessage(CharBuffer charBuffer) throws IOException {
                //TODO process message
            }
        };  //To change body of implemented methods use File | Settings | File Templates.
    }
}
