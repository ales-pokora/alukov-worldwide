export const useSidebar = () => {
  const isOpen = useState<boolean>("sidebar-open", () => false);
  const open = () => (isOpen.value = true);
  const close = () => (isOpen.value = false);
  const toggle = () => {
    isOpen.value = !isOpen.value;
    console.log(isOpen.value);
  };
  return { isOpen, open, close, toggle };
};
