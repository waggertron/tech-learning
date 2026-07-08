// @ts-nocheck
import { ClassicPaymentForm } from "../../content/docs/posts/_react-example-modules/ClassicPaymentForm";
import { NewPaymentSheet } from "../../content/docs/posts/_react-example-modules/NewPaymentSheet";

type CheckoutPageProps = {
  flags: {
    newPaymentSheet: boolean;
  };
};

export function CheckoutPage({ flags }: CheckoutPageProps) {
  return flags.newPaymentSheet ? (
    <NewPaymentSheet />
  ) : (
    <ClassicPaymentForm />
  );
}
