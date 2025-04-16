package com.savms.demo.ai;

import org.json.JSONObject;

public class AiResponseBodyParser {
    /**
     * Extract the answer and get rid of the thinking part of a response body
     * @param bodyJson The body in JSON of the response
     * @return The answer part
     */
    public String getAnswer(String bodyJson) {
        final String endLabelOfThink = "</think>";
        final String responseKey = "response";

        JSONObject jsonObject = new JSONObject(bodyJson);
        String responseValue = jsonObject.getString(responseKey);
        int startIdx = responseValue.lastIndexOf(endLabelOfThink) + endLabelOfThink.length();
        String answer = responseValue.substring(startIdx);
        startIdx = 0;
        while (startIdx < answer.length() && answer.charAt(startIdx) == '\n') {
            ++startIdx;
        }
        answer = answer.substring(startIdx);
        return answer;
    }
}
