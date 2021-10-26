import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
//eslint-disable-next-line

import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "components/misc/Headings.js";
import { SectionDescription } from "components/misc/Typography.js";

import { ReactComponent as SvgDecoratorBlob3 } from "images/svg-decorator-blob-3.svg";

const Container = tw.div`relative`;

const ThreeColumnContainer = styled.div`
  ${tw`flex flex-col items-center md:items-stretch md:flex-row flex-wrap md:justify-center max-w-screen-lg mx-auto py-20 md:py-24`}
`;
const Subheading = tw(SubheadingBase)`mb-4`;
const Heading = tw(SectionHeading)`w-full`;
const Description = tw(SectionDescription)`w-full text-center`;

const VerticalSpacer = tw.div`mt-10 w-full`;

const Column = styled.div`
  ${tw`md:w-1/2 lg:w-1/3 max-w-sm`}
`;

const Card = styled.div`
  ${tw`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left h-full mx-4 px-2 py-8`}
  .imageContainer {
    ${tw`border text-center rounded-full p-5 flex-shrink-0`}
    img {
      ${tw`w-6 h-6`}
    }
  }

  .textContainer {
    ${tw`sm:ml-4 mt-4 sm:mt-2`}
  }

  .title {
    ${tw`mt-4 tracking-wide font-bold text-2xl leading-none`}
  }

  .description {
    ${tw`mt-1 sm:mt-4 font-medium text-secondary-100 leading-loose`}
  }
`;

const DecoratorBlob = styled(SvgDecoratorBlob3)`
  ${tw`pointer-events-none absolute right-0 bottom-0 w-64 opacity-25 transform translate-x-32 translate-y-48 `}
`;

export default ({
  cards = null,
  heading = "Details of Our Users",
  subheading = "Details you can see",
  description = "This is the data stats of our users.",
}) => {
  let totalLostDocs = 0;
  let totalFoundDocs = 0;
  let totalMatchedAndReturnedDocs = 0;
  let numUser;

  const totalUsers = async () => {
    const response = await fetch("http://localhost:5555/api/users/numUser");
    const responseData = await response.json();
    console.log(responseData);
    numUser = responseData.totalUser;
    console.log(numUser);
  };
  totalUsers();
  //   console.log(totalUser);
  console.log(numUser);

  const defaultCards = [
    {
      title: "Total Users",
      description: `${numUser} are enjoying project.`,
    },
    {
      title: "Total Lost Document Uploads",
      description: `${totalLostDocs} have been lost docs uploaded.`,
    },
    {
      title: "Total Found Document Uploads",
      description: `${totalFoundDocs} have been lost docs uploaded.`,
    },
    {
      title: "Matched and Returned",
      description: `${totalMatchedAndReturnedDocs} have been lost docs uploaded.`,
    },
  ];
  //   console.log(totalUser);

  if (!cards) cards = defaultCards;

  return (
    <Container>
      <ThreeColumnContainer>
        {subheading && <Subheading>{subheading}</Subheading>}
        <Heading>{heading}</Heading>
        {description && <Description>{description}</Description>}
        <VerticalSpacer />
        {cards.map((card, i) => (
          <Column key={i}>
            <Card>
              <span className="textContainer">
                <span className="title">{card.title || "Fully Secure"}</span>
                <p className="description">{card.description}</p>
              </span>
            </Card>
          </Column>
        ))}
      </ThreeColumnContainer>
      <DecoratorBlob />
    </Container>
  );
};
