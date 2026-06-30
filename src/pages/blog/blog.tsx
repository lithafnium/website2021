import React from "react";
import { useNavigate } from "react-router-dom";
import { FadeIn } from "@app/shared/components/fade";
import { posts } from "@app/blog/posts";
import { ContainerInner, PostCard, PostDate } from "./styles";

const formatDate = (date: string): string => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Blog = () => {
  const navigate = useNavigate();

  return (
    <ContainerInner>
      <p>
        a collection of writing on systems, ML, and whatever else i'm thinking
        about.
      </p>
      <FadeIn>
        {posts.map((post) => (
          <PostCard
            key={post.slug}
            onClick={() => navigate(`/blog/${post.slug}`)}
          >
            <PostDate>{formatDate(post.date)}</PostDate>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
          </PostCard>
        ))}
      </FadeIn>
    </ContainerInner>
  );
};

export default Blog;
