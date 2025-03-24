package com.savms.demo.ai;

import okhttp3.*;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

public class LocalDeepseekOllamaDemo {
    public static void main(String[] args) {
        final int port = 11434;
        final String model = "deepseek-r1:8b";

        generateApiNoStream(port, model, "generate 3 english names in this format: <name1> | <name2> | <name3>. don't tell me your thinking process");
        //chatApiNoStream(port, model, "generate 3 english names in this format: <name1> | <name2> | <name3>. don't tell me your thinking process");
    }

    // demo of /api/generate without stream of ollama
    // NOTE: AI will return how it thinks in response, even when it's told not to do that, which might be unwanted (deepseek-r1:8b)
    static void generateApiNoStream(int port, String model, String prompt) {
        OkHttpClient client = new OkHttpClient().newBuilder()
                .readTimeout(1, TimeUnit.MINUTES)
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

    // demo of /api/chat without stream of ollama
    // NOTE: AI will return how it thinks in response, even when it's told not to do that, which might be unwanted (deepseek-r1:8b)
    static void chatApiNoStream(int port, String model, String userMsg) {
        OkHttpClient client = new OkHttpClient().newBuilder()
                .readTimeout(1, TimeUnit.MINUTES)
                .build();
        MediaType mediaType = MediaType.parse("application/json");
        String msg = String.format("{\"model\":\"%s\", \"messages\":[{\"role\":\"user\", \"content\":\"%s\"}], \"stream\":false}", model, userMsg);
        RequestBody body = RequestBody.create(mediaType, msg);
        Request request = new Request.Builder()
                .url(String.format("http://127.0.0.1:%d/api/chat", port))
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
