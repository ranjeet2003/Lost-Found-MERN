import React from "react";
import tw from "twin.macro";
import { FaRupeeSign } from "react-icons/fa";

import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Hero from "components/hero/TwoColumnWithInput.js";
import Features from "components/features/ThreeColWithSideImage";
import MainFeature from "components/features/TwoColWithButton.js";
import MainFeature2 from "components/features/TwoColWithTwoHorizontalFeaturesAndButton.js";
import FeatureWithSteps from "components/features/TwoColWithSteps.js";
// import Pricing from "components/pricing/ThreePlans.js";
import Testimonial from "components/testimonials/TwoColumnWithImageAndRating.js";
import FAQ from "components/faqs/SingleCol.js";
// import GetStarted from "components/cta/GetStarted";
import Footer from "components/footers/SimpleFiveColumn";
// import heroScreenshotImageSrc from "images/hero-screenshot-1.png";
import heroScreenshotImageSrc1 from "images/logo1.jpg";
// import macHeroScreenshotImageSrc from "images/hero-screenshot-2.png";
import aboutImage from "images/about.png";
import donateImageSrc from "images/donate.jpg";
// import { ReactComponent as BriefcaseIcon } from "feather-icons/dist/icons/briefcase.svg";
// import { ReactComponent as MoneyIcon } from "feather-icons/dist/icons/dollar-sign.svg";

export default () => {
  const Subheading = tw.span`uppercase tracking-widest font-bold text-primary-500`;
  const HighlightedText = tw.span`text-primary-500`;

  return (
    <AnimationRevealPage>
      <Hero roundedHeaderButton={true} />
      <Features
        // subheading={<Subheading>Features</Subheading>}
        heading={
          <>
            How we <HighlightedText>Work ?</HighlightedText>
          </>
        }
      />
      <MainFeature
        subheading={<Subheading>Don't worry about security</Subheading>}
        imageSrc={heroScreenshotImageSrc1}
        imageBorder={false}
        imageDecoratorBlob={false}
      />
      <FeatureWithSteps
        subheading={<Subheading>STEPS</Subheading>}
        heading={
          <>
            Easy to <HighlightedText>Get Started.</HighlightedText>
          </>
        }
        textOnLeft={false}
        imageSrc={aboutImage}
        imageDecoratorBlob={true}
        decoratorBlobCss={tw`xl:w-40 xl:h-40 opacity-15 -translate-x-1/2 left-1/2`}
      />
      <MainFeature2
        subheading={<Subheading>Help Us</Subheading>}
        heading={
          <>
            Help us by donating a little to{" "}
            <HighlightedText>Motivate us.</HighlightedText>
          </>
        }
        imageSrc={donateImageSrc}
        showDecoratorBlob={true}
        features={[
          {
            Icon: FaRupeeSign,
            title: "Affordable",
            description:
              "We promise to offer you the best from our side. If your docs are returned back to you, please donate us. A major part of your donation will pay the founder person so that people motivate to upload found docs.",
            iconContainerCss: tw`bg-red-300 text-red-800`,
          },
          // {
          //   Icon: BriefcaseIcon,
          //   title: "Professionalism",
          //   description:
          //     "We assure you that our templates are designed and created by professional designers.",
          //   iconContainerCss: tw`bg-red-300 text-red-800`,
          // },
        ]}
      />
      {/* <Pricing
        subheading={<Subheading>Pricing</Subheading>}
        heading={
          <>
            Reasonable & Flexible <HighlightedText>Plans.</HighlightedText>
          </>
        }
        plans={[
          {
            name: "Personal",
            price: "$17.99",
            duration: "Monthly",
            mainFeature: "For Individuals",
            features: [
              "30 Templates",
              "7 Landing Pages",
              "12 Internal Pages",
              "Basic Assistance",
            ],
          },
          {
            name: "Business",
            price: "$37.99",
            duration: "Monthly",
            mainFeature: "For Small Businesses",
            features: [
              "60 Templates",
              "15 Landing Pages",
              "22 Internal Pages",
              "Priority Assistance",
            ],
            featured: true,
          },
          {
            name: "Enterprise",
            price: "$57.99",
            duration: "Monthly",
            mainFeature: "For Large Companies",
            features: [
              "90 Templates",
              "27 Landing Pages",
              "37 Internal Pages",
              "Personal Assistance",
            ],
          },
        ]}
      /> */}
      <Testimonial
        subheading={<Subheading>Testimonials</Subheading>}
        heading={
          <>
            Experience of people who{" "}
            <HighlightedText>got their docs.</HighlightedText>
          </>
        }
        testimonials={[
          {
            stars: 5,
            profileImageSrc:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3.25&w=512&h=512&q=80",
            heading: "Amazing Service and Experience",
            quote:
              "I got message from lost-found.team that your docs details are matched with someone just after two days of uploading documents and I found my bag just in 3 days, thanks lost-found.team.",
            customerName: "Charlotte Hale",
            // customerTitle: "Director, Delos Inc.",
          },
          {
            stars: 5,
            profileImageSrc:
              "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=512&h=512&q=80",
            heading: "Love the platform Experience and idea !",
            quote:
              " This website is very helpfull for me. I lost my some very important documents and I was very sad, disappointed. Then my friend Elize told me about this portal and I got my lost documents. Thanks Lost-Found.team.",
            customerName: "Adam Cuppy",
            // customerTitle: "Founder, EventsNYC",
          },
        ]}
      />
      <FAQ
        subheading={<Subheading>FAQS</Subheading>}
        heading={
          <>
            You have <HighlightedText>Questions ?</HighlightedText>
          </>
        }
        faqs={[
          {
            question: "I have lost my docs, how can I upload details ?",
            answer:
              "Uploading documents are so easy. just create a account with us in sign-up section and click on lost something. Register the complete details of documents that you have lost. If anyone will find the docs, we will send a notification to you.",
          },
          {
            question: "I have found docs, how can I upload details ?",
            answer:
              "Uploading documents are so easy. just create a account with us in sign-up section and click on found something. Register the complete details of documents that you have found. We match the details in our database and if matched, we will send a notification to you.",
          },
          {
            question: "How the doucuments matching will perform ?",
            answer:
              "Matching the document is performed by 'Optical Character Recognition'. It is mandatory to upload a clease, visible image of document so that machine can recognise all the text.",
          },
          {
            question: "Is my document are secured in your database ?",
            answer:
              "Yes, your document detail are very secured in our database. We encrypt the document with a secure encryption algorithms after uploading in our database so that no one can see the details of documents.",
          },
          {
            question: "How we get the notification ?",
            answer:
              "If the lost/found document are matched with our database, we will send you a text SMS and an E-mail to your registered mobile number.",
          },
          {
            question: "What after getting the notification ?",
            answer:
              "After you got the docs matching notification, you are required to contact that person and on your both convinience you take back your documents",
          },
        ]}
      />
      {/* <GetStarted /> */}
      <Footer />
    </AnimationRevealPage>
  );
};
