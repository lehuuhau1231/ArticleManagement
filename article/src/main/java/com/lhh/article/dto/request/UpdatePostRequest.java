package com.lhh.article.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdatePostRequest {
    @NotNull(message = "Id is required")
    private Integer id;
    private String title;
    private String content;
}
