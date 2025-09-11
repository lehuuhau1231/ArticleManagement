package com.lhh.article.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PostTitleResponse {
    private Integer id;
    private String title;
    private String description;
    private String image;
    private LocalDateTime updatedAt;
}
