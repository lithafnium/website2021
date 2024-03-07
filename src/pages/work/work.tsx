import React, { useState } from "react";
import { Bold, Link, colors } from "@app/styles/styles";
import { FadeIn } from "@app/shared/components/fade";
import {
  ContainerInner,
  WorkContainer,
  Tabs,
  Tab,
  Content,
  ActiveLine,
  Panel,
  Date,
  List,
  ListItem,
} from "./styles";
import { COMPANIES, DESCRIPTIONS } from "./constsants";

const Work = () => {
  const [index, setIndex] = useState(0);

  return (
    <ContainerInner>
      <WorkContainer>
        <Tabs>
          {COMPANIES.map((w: any, i: any) => (
            <Tab onClick={() => setIndex(i)} active={index === i}>
              {w}
            </Tab>
          ))}

          <ActiveLine index={index} />
        </Tabs>
        <Content>
          <Panel>
            <FadeIn>
              <h3>
                {DESCRIPTIONS[index].role} @{" "}
                <Bold>
                  <Link href={DESCRIPTIONS[index].link}>
                    {COMPANIES[index]}
                  </Link>
                </Bold>
              </h3>
              <Date>{DESCRIPTIONS[index].date}</Date>
              <List>
                {DESCRIPTIONS[index].description.map((d: any, i: any) => {
                  return <ListItem key={i}>{d}</ListItem>;
                })}
              </List>
            </FadeIn>
          </Panel>
        </Content>
      </WorkContainer>
    </ContainerInner>
  );
};

export default Work;
