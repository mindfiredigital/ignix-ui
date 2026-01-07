import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageCard } from ".";
import { Star, Heart, Share2, Download, SkipBack, Play, SkipForward} from "lucide-react"

const meta: Meta<typeof ImageCard> = {
  title: "Templates/Patterns/ImageCard",
  component: ImageCard,
  parameters: {
    layout: "centered",
  },
  args: {
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    title: "Beautiful Landscape",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Hic, ipsum ab. Tenetur explicabo iste quisquam unde? Ipsam impedit eligendi nostrum vel voluptatem quia eius beatae atque sequi saepe, at magni quos. Vitae officia quae sunt illum, et inventore exercitationem quis dolorem quibusdam sed explicabo tempore suscipit magni incidunt molestias iusto unde quia facere accusamus voluptate earum impedit a. Veniam magnam nisi veritatis in atque libero dicta dolore at sint, magni corporis nobis sit eligendi numquam. Recusandae veritatis dolore dicta quis animi, reiciendis laboriosam amet aut, ut molestiae quia fugit magnam ipsum. Omnis aperiam et eveniet alias blanditiis error aut deleniti illum hic velit odio aliquam, atque rem reiciendis voluptates recusandae doloribus quis vero voluptatem enim asperiores molestias ipsa! Praesentium enim fugit eius minima in ullam, nulla, doloremque quaerat facilis explicabo ea odit laudantium, expedita nisi? Error sint magni eos eum quis repellat! Molestias, illum adipisci in architecto labore nisi qui iste alias ea odit expedita aspernatur id exercitationem placeat ab deserunt provident voluptas fugit cupiditate eos ex? Odio, esse? Nostrum, eius excepturi temporibus minus repudiandae non consectetur esse deserunt veritatis doloribus, reiciendis sapiente dolor quisquam quis earum rem. Repudiandae, commodi error delectus veniam quos impedit voluptatibus. Mollitia repellat rem non esse aperiam id, quod accusantium consequatur quo porro ad cum, culpa assumenda, perspiciatis tempora laborum molestias minima? Nemo nulla, quos quo dolorum error facere deleniti voluptatum in incidunt reprehenderit nihil voluptatem repellendus sequi provident cupiditate et eligendi dolore obcaecati recusandae, aliquid reiciendis similique sunt! Tempora blanditiis quo dolorem, iusto laborum dolores eveniet, velit aperiam natus dignissimos at nam est molestiae recusandae, ipsa in praesentium delectus impedit nisi? Incidunt porro vero ad? Architecto, numquam eos. Sunt nam quisquam, quidem esse dicta eaque alias perspiciatis cum corrupti velit illum veritatis, laborum repudiandae. A minima aspernatur id ipsa, illum asperiores eaque veniam ipsum voluptatum quis ipsam delectus commodi voluptas cumque quo nobis tempore quasi consectetur? Maxime maiores repellat ipsum repudiandae quam sapiente, excepturi dicta atque? Repudiandae autem distinctio eveniet quos provident. Voluptate unde exercitationem fugit, magnam vero dolor saepe praesentium numquam inventore magni eos sed voluptatibus iste voluptates odio maxime, ipsum doloribus cumque temporibus. Vel veniam velit animi officiis illum, culpa, facilis impedit modi nemo autem quos nobis ratione amet illo ut ipsam architecto perspiciatis at molestiae dolor commodi debitis unde. Eos odit provident quibusdam autem, voluptate quasi enim consectetur possimus eveniet nulla quas veritatis adipisci, quia eligendi. Soluta placeat quasi dolor reprehenderit.",
    layout: "overlay",
    variant: "default",
    button:[
      { label: "Docs", href: "/docs" },
      { label: "GitHub", href: "https://github.com" },
      {
        href: "https://github.com",
        icon: Star ,
        ariaLabel: "GitHub repository",
      },
    ]
  },
  argTypes: {
    layout: {
      control: "select",
      options: ["overlay", "below"],
      description: "Layout style for the card content",
    },
    variant: {
      control: "select",
      options: [
        "dark",
        "default",
        "light",
        "green",
        "purple",
        "red",
        "orange",
        "pink",
        "elegant",
        "vibrant",
        "ocean",
        "sunset",
        "forest",
        "minimal",
        "royal",
      ],
      description: "Variant style for the card category badge",
    },
    image: {
      control: "text",
      description: "Image URL to display",
    },
    title: {
      control: "text",
      description: "Card title",
    },
    description: {
      control: "text",
      description: "Card description",
    },
    category: {
      control: "text",
      description: "Category label",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ImageCard>;

export const DefaultOverlay: Story = {
  args: {
    variant:"default"
  },
};

export const DefaultBelow: Story = {
  args: {
    size: "md",
    layout: "below"
  }
};

export const LeftBelow: Story = {
  args: {
    size: "md",
    mediaPosition: "left",
    layout: "below"
  }
};

export const DifferentSizes: Story = {
  render: ({...args }) => (
    <div className="flex flex-row gap-8 flex-wrap justify-center items-start w-full">
      {(["sm", "md", "lg", "xl"] as const).map((cardSize) => (
        <ImageCard
          key={cardSize}
          {...args}
          size={cardSize}
        />
      ))}
    </div>
  ),
  args: {
    layout: "overlay",
    variant: "default",
  },
  parameters: {
    layout: "padded",
  },
};

export const OverlayError: Story = {
  args: {
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b47",
    variant:"default"
  },
};

export const BelowError: Story = {
  render: () => (
    <ImageCard
      image="https://images.unsplash.com/photo-1500530855697-b586d89ba3"
      title="Sunflower Field"
      layout="below"
      description="A beautiful sunflower field captured during the daytime."
      category="Nature"
    />
  ),
};

export const LinkClickDemonstration: Story = {
  render: () => {
    const handleLike = () => {
      alert("You liked this card! ❤️");
    };

    const handleShare = () => {
      if (navigator.share) {
        navigator.share({
          title: "Beautiful Landscape",
          text: "Check out this amazing landscape!",
          url: window.location.href,
        }).catch((err) => console.log("Error sharing:", err));
      } else {
        alert("Share functionality clicked! (Native share not available)");
      }
    };

    const handleDownload = () => {
      alert("Download started! ⬇️");
    };

    return (
      <div className="space-y-8 items-center">
        <div>
          <ImageCard
            image="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
            title="Interactive Card with Actions"
            description="Click the links below to see different actions in action. Check the browser console for logged events."
            category="Interactive"
            layout="below"
            variant="default"
            button={[
              { 
                icon: Heart,
                onClick: handleLike,
                ariaLabel: "Like this card"
              },
              { 
                icon: Share2,
                onClick: handleShare,
                ariaLabel: "Share this card"
              },
              { 
                icon: Download,
                onClick: handleDownload,
                ariaLabel: "Download this image"
              },
            ]}
          />
        </div>

        <div className="mt-8 p-4 bg-slate-100 rounded-lg">
          <h4 className="font-semibold mb-2">💡 Instructions:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
            <li>Click on any link or icon to see the action</li>
            <li>Hover over icons to see them fill with color</li>
            <li>Links with href will navigate to the URL</li>
            <li>Links with onClick will trigger custom actions</li>
            <li>In overlay layout, hover over the card to reveal links</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    layout: "centered",
  },
};

export const MediaControlCard: Story = {
  args: {
    mode: "media",
    mediaPosition: "left",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    title: "Live From Space",
    description: "Mac Miller",
    size: "lg",
    button: [
      {
        icon: SkipBack,
        ariaLabel: "Previous track",
        onClick: () => alert("Previous"),
      },
      {
        icon: Play,
        ariaLabel: "Play",
        onClick: () => alert("Play"),
      },
      {
        icon: SkipForward,
        ariaLabel: "Next track",
        onClick: () => alert("Next"),
      },
    ],
  },
  argTypes: {
    mediaPosition: {
      control: "radio",
      options: ["left", "right", "top"],
      description: "Position of media image",
    },
  },
  parameters: {
    layout: "centered",
  },
}



