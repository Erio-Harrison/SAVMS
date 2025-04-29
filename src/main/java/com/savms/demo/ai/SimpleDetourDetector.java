package com.savms.demo.ai;

import okhttp3.*;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * Implement the simple version of detouring detection strategy
 */
public class SimpleDetourDetector implements DetourDetector {
    private AiResponseBodyParser aiResponseBodyParser;
    private OkHttpClient client;
    private int port = 11434;
    private String model = "deepseek-r1:8b";
    private MediaType mediaType;
    private long timeout = 10;

    public SimpleDetourDetector() {
        this.aiResponseBodyParser = new AiResponseBodyParser();
        this.client = new OkHttpClient().newBuilder()
                .readTimeout(timeout, TimeUnit.MINUTES)
                .build();
        this.mediaType = MediaType.parse("application/json");
    }

    public String execute(DetourDetectCommand cmd) {
        final String prompt = String.format("I will give you the source and destination of a route and the current position of a vehicle. " +
                "You need to decide whether a driver is detouring or not by calculating if the current position is far away from the intended route defined by the source and the destination. " +
                "The source is %s. The destination is %s. The current position is %s. All of them are shown in the coordination of latitude and longitude. " +
                "Just give me a yes or no answer.", cmd.getSrc(), cmd.getDst(), cmd.getCurrent());

        String msg = String.format("{\"model\":\"%s\", \"prompt\":\"%s\", \"stream\":false}", model, prompt);
        RequestBody body = RequestBody.create(mediaType, msg);
        Request request = new Request.Builder()
                .url(String.format("http://127.0.0.1:%d/api/generate", port))
                .method("POST", body)
                .addHeader("Content-Type", "application/json")
                .addHeader("Accept", "application/json")
                .build();
        try {
            Response response = client.newCall(request).execute();
            if (response.body() != null) {
                String bodyStr = response.body().string();
                return aiResponseBodyParser.getAnswer(bodyStr);
            } else {
                throw new RuntimeException("response body is null");
            }
        } catch (IOException ex) {
            throw new RuntimeException("io exception occurred: " + ex.getMessage());
        }
    }

    public void setTimeout(long timeout) {
        if (timeout > 0) {
            this.timeout = timeout;
        }
    }

    public long getTimeout() {
        return timeout;
    }
}
