function ModalContainer({ children, visible, onClose, ignoreContainer }) {
  if (!visible) return;

  function renderChildren() {
    if (ignoreContainer) return children;
    return (
      <div
        className="dark:bg-primary bg-white h-[30rem] w-[40rem] overflow-auto p-2 custom-scroll-bar"
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    );
  }
  function handleCloseModal() {
    onClose();
  }
  return (
    <div
      className="fixed inset-0 dark:bg-white/50 bg-primary/50 backdrop-blur-sm flex items-center justify-center"
      onMouseDown={handleCloseModal}
    >
      {renderChildren()}
    </div>
  );
}

export default ModalContainer;
