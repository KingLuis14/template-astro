export type Variants<T> = {
  [P in keyof T]: keyof T[P];
}


const wrapper = {
  variants: {
    size: {
      large: "wrapper--lg",
      medium: "wrapper--sm",
      form: "wrapper--form",
    },
    align: {
      left: "text-start",
      center: "text-center",
      end: "text-end",
    },
    textcolor: {
      black: "color-black-000",
      white: "color-white-000",
      green: "color-green-500",
    },
  },
  compoundVariants: [],
};



