"use client"
import React, { useState, useEffect } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

type FAQItem = {
  question: string;
  answer: string;
};

export default function FAQSection() {
  const [faqData, setFaqData] = useState<FAQItem[]>([]);

  // Fetch FAQ data from the JSON file
  useEffect(() => {
    const fetchFAQ = async () => {
      const response = await import("@/app/utils/FAQ/course/faq.json");
      setFaqData(response.default);
    };
    fetchFAQ();
  }, []);

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {faqData.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className=" mt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
      <CardFooter className="text-center">
        Have more questions? Contact our support team.
      </CardFooter>
    </Card>
  );
}
