package com.lhh.article.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized exception", HttpStatus.INTERNAL_SERVER_ERROR),
    EMAIL_EXISTS(1001, "Email is exists", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1002, "User not found", HttpStatus.NOT_FOUND),
    PASSWORD_INVALID(1004, "password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    WRONG_PASSWORD(1005, "Wrong password", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_TOKEN(1008, "Invalid token", HttpStatus.BAD_REQUEST),
    POST_NOT_FOUND(1009, "Post not found", HttpStatus.NOT_FOUND),
    FILE_INVALID(1012, "File invalid", HttpStatus.BAD_REQUEST),
    FILE_NOT_FOUND(1013, "File not found", HttpStatus.BAD_REQUEST),
    ;


    private int code;
    private String message;
    private HttpStatusCode httpStatusCode;

    ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
        this.code = code;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }
}
