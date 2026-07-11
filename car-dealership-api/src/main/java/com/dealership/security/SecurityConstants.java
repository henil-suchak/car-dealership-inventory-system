package com.dealership.security;

public interface SecurityConstants {
    String AUTH_WHITELIST = "/api/auth/**";
    String HEADER_STRING = "Authorization";
    String TOKEN_PREFIX = "Bearer ";
}