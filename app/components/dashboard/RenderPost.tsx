"use client"; // Ensures this code only runs on the client

import React, { useEffect, useState } from "react";
import { JSONContent } from "novel";
import { generateHTML } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import BlockQuote from "@tiptap/extension-blockquote";
import TextStyle from "@tiptap/extension-text-style";
import Bold from "@tiptap/extension-bold";
import CodeBlock from "@tiptap/extension-code-block";
import OrderedList from "@tiptap/extension-ordered-list";
import HardBreak from "@tiptap/extension-hard-break";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Italic from "@tiptap/extension-italic";


// Define a default JSONContent structure to use as a fallback
const defaultJSONContent: JSONContent = {
  "type": "doc", "content": [{ "type": "heading", "attrs": { "level": 1 }, "content": [{ "text": "Welcome!", "type": "text" }] }, { "type": "paragraph", "content": [{ "text": "This site is a work in progress, born from the idea of building a community-driven resource hub to help future learners find the resources we once had to search high and low for. The aim is to gather Google and YouTube links that make studying easier, more accessible, and collaborative. Although still under development, this platform will hopefully become a valuable tool for sharing knowledge and resources that streamline the learning journey for everyone.", "type": "text" }] }, { "type": "paragraph" }, { "type": "blockquote", "content": [{ "type": "paragraph", "content": [{ "text": "Feel Free to edit any page if you have more up to date or valid information. Be responsible.", "type": "text" }] }] }, { "type": "paragraph" }]

};

export function RenderPost({ json }: { json: JSONContent }) {
  const [outPut, setOutPut] = useState<string>("");

  useEffect(() => {
    const validatedJSON = json?.type === "doc" ? json : defaultJSONContent;

    try {
      const generatedHTML = generateHTML(validatedJSON, [
        Document,
        Paragraph,
        Text,
        Link,
        Underline,
        Heading,
        ListItem,
        BulletList,
        Code,
        BlockQuote,
        TextStyle,
        TaskItem,
        TaskList,
        CodeBlock,
        OrderedList,
        Italic,
        Bold,
        HardBreak,
      ]);

      setOutPut(generatedHTML);
    } catch (error) {
      console.error("Error rendering JSONContent:", error);
      const fallbackHTML = generateHTML(defaultJSONContent, [
        Document,
        Paragraph,
        Text,
        Link,
        Underline,
        Heading,
        ListItem,
        BulletList,
        Code,
        BlockQuote,
        TextStyle,
        TaskItem,
        TaskList,
        CodeBlock,
        OrderedList,
        Italic,
        Bold,
        HardBreak,
      ]);
      setOutPut(fallbackHTML);
    }
  }, [json]);

  return (
    <div
      className="prose m-auto w-11/12 sm:prose-lg dark:prose-invert sm:w-2/3 prose-li:marker:text-primary prose-blockquote:text-primary"
      dangerouslySetInnerHTML={{ __html: outPut }}
    />
  );
}
