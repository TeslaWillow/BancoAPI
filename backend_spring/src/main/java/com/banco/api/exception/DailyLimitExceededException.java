// ./src/main/java/com/banco/api/exception/DailyLimitExceededException.java
package com.banco.api.exception;

public class DailyLimitExceededException extends BusinessException {
    public DailyLimitExceededException(String message) {
        super(message);
    }
}
