package com.luv2code.spring_boot_library.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class ExtractJWT {
    public static String payloadJWTExtract(String token, String extraction) {
        token.replace("Bearer", "");

        String[] chunks = token.split("\\.");
        Base64.Decoder decoder = Base64.getUrlDecoder();
        String payload = new String(decoder.decode(chunks[1]));

        ObjectMapper mapper = new ObjectMapper();
        JsonNode parent = null;
        try {
            parent = mapper.readTree(payload);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        String content = parent.path(extraction).asText();
        return content;
    }
}
