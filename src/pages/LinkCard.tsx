import { useEffect } from "react";

const LinkCard = () => {
  useEffect(() => {
    document.title = "LyticalPilot - Linking Your Card";
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-2">Linking Your Card</h1>
      <p className="text-muted-foreground">Securely connect your payment cards for faster checkout.</p>
    </section>
  );
};

export default LinkCard;
