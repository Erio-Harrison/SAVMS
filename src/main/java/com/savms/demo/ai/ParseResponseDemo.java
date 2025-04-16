package com.savms.demo.ai;

import okhttp3.*;
import org.json.JSONObject;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

// Based on ollama deepseek-r1:8b
public class ParseResponseDemo {
    public static void main(String[] args) {
        final int port = 11434;
        final String model = "deepseek-r1:8b";

        final String prompt = "generate 3 english names in this format: <name1> | <name2> | <name3>. your response should only contain the answer.";

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
            if (response.body() != null) {
                String bodyStr = response.body().string();
                System.out.println((bodyStr));
                System.out.println("==============");
                System.out.println(new AiResponseBodyParser().getAnswer(bodyStr));
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
