package com.savms.demo.ai;

import okhttp3.*;

import java.io.IOException;

public class LocalDeepseekOllamaDemo {
    public static void main(String[] args) {
        final int port = 11434;
        final String model = "deepseek-r1:8b";

        generateApiNoStream(port, model, "happy");
    }

    // demo of /api/generate without stream of ollama
    static void generateApiNoStream(int port, String model, String prompt) {
        OkHttpClient client = new OkHttpClient().newBuilder()
                .build();
        MediaType mediaType = MediaType.parse("application/json");
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

            System.out.println(response);
            System.out.println((response.body() == null ? "null" : response.body().string()));
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
