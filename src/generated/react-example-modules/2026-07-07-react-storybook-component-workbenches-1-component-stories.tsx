// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react";
import { ProductCard } from "../../content/docs/posts/_react-example-modules/ProductCard";

const meta = {
  component: ProductCard,
  title: "Catalog/ProductCard",
} satisfies Meta<typeof ProductCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InStock: Story = {
  args: {
    name: "Trail shoes",
    priceCents: 12900,
    inStock: true,
  },
};

export const BackSoon: Story = {
  args: {
    name: "Rain shell",
    priceCents: 9900,
    inStock: false,
  },
};
