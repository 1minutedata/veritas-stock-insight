import { useEffect } from "react";

const Payments = () => {
  useEffect(() => {
    document.title = "Veritasier - Payment Processing";
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-2">Payment Processing</h1>
      <p className="text-muted-foreground">Manage subscriptions, invoices, and transactions.</p>
    </section>
  );
};

export default Payments;
