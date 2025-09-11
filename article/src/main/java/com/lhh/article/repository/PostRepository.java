package com.lhh.article.repository;

import com.lhh.article.dto.response.PostResponse;
import com.lhh.article.dto.response.PostTitleResponse;
import com.lhh.article.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {
    @Query("SELECT new com.lhh.article.dto.response.PostResponse(p.id, p.title, p.description, u.fullName, p.image, p.updatedAt) " +
            "FROM Post p " +
            "JOIN p.user u " +
            "WHERE (:kw IS NULL OR p.title LIKE %:kw% OR p.content LIKE %:kw%) " +
            "ORDER BY p.id DESC")
    Page<PostResponse> findAll(@Param("kw") String kw, Pageable pageable);

    @Query("SELECT new com.lhh.article.dto.response.PostResponse(p.id, p.description, p.title, p.content, u.fullName, p.image, p.updatedAt) " +
            "FROM Post p " +
            "JOIN p.user u " +
            "WHERE p.id = :id")
    PostResponse getPostById(@Param("id") Integer id);

    @Query("SELECT new com.lhh.article.dto.response.PostTitleResponse(p.id, p.title, p.description, p.image, p.updatedAt) " +
            "FROM Post p " +
            "JOIN p.user u " +
            "WHERE u.email = :email " +
            "AND :title IS NULL OR p.title LIKE %:title% " +
            "ORDER BY p.id DESC")
    Page<PostTitleResponse> getPostsByUserEmail(@Param("email") String email, @Param("title") String title, Pageable pageable);

}
