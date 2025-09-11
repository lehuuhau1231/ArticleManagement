package com.lhh.article.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PostResponse {
    private Integer id;
    private String description;
    private String title;
    private String content;
    private String fullName;
    private String image;
    private LocalDateTime updatedAt;

    public PostResponse(Integer id, String title, String description, String fullName, String image, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.fullName = fullName;
        this.image = image;
        this.updatedAt = updatedAt;
    }

}
