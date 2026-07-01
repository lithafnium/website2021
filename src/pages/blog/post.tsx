import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypePrism from "rehype-prism-plus";
import { FadeIn } from "@app/shared/components/fade";
import { getPost } from "@app/blog/posts";
import {
  Article,
  Container,
  Heading,
  HeaderImage,
  Navbar,
  NavbarOptions,
  PostMetaDate,
  PostTitle,
} from "./styles";

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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPost(slug) : undefined;

  useEffect(() => {
    document.title = post ? `${post.title} — Steve Li` : "Steve Li";
    return () => {
      document.title = "Steve Li";
    };
  }, [post]);

  return (
    <Container>
      <Heading>
        <Navbar>
          <h2 onClick={() => navigate("/")}>hi, i'm steve li</h2>
          <NavbarOptions>
            <p onClick={() => navigate("/projects")}>projects</p>
            <p onClick={() => navigate("/blog")}>blog</p>
          </NavbarOptions>
        </Navbar>
        {post ? (
          <FadeIn>
            <HeaderImage src={post.image} alt={post.title} />
            <PostTitle>{post.title}</PostTitle>
            <PostMetaDate>{formatDate(post.date)}</PostMetaDate>
            <Article>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeRaw,
                  [rehypePrism, { ignoreMissing: true }],
                ]}
              >
                {post.body}
              </ReactMarkdown>
            </Article>
          </FadeIn>
        ) : (
          <p>post not found.</p>
        )}
      </Heading>
    </Container>
  );
};

export default BlogPost;
