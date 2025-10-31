import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { HashtagNode } from "@lexical/hashtag"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { OverflowNode } from "@lexical/overflow"
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from "lexical"

import { AutocompleteNode } from "@/src/components/editor/nodes/autocomplete-node"
import { TweetNode } from "@/src/components/editor/nodes/embeds/tweet-node"
import { YouTubeNode } from "@/src/components/editor/nodes/embeds/youtube-node"
import { EmojiNode } from "@/src/components/editor/nodes/emoji-node"
import { ImageNode } from "@/src/components/editor/nodes/image-node"
import { KeywordNode } from "@/src/components/editor/nodes/keyword-node"
import { LayoutContainerNode } from "@/src/components/editor/nodes/layout-container-node"
import { LayoutItemNode } from "@/src/components/editor/nodes/layout-item-node"
import { MentionNode } from "@/src/components/editor/nodes/mention-node"

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    OverflowNode,
    HashtagNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    CodeNode,
    CodeHighlightNode,
    HorizontalRuleNode,
    MentionNode,
    ImageNode,
    EmojiNode,
    KeywordNode,
    LayoutContainerNode,
    LayoutItemNode,
    AutoLinkNode,
    TweetNode,
    YouTubeNode,
    AutocompleteNode,
  ]
