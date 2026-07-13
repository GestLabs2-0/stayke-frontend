export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqAccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}
