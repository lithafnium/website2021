import React, { useState } from "react";
import { colors } from "@app/styles/styles";
import { FadeIn } from "@app/shared/components/fade";
import {
  Container,
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
    <>
      <Container>
        <ContainerInner>
          <h1>work experience</h1>
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
                    {DESCRIPTIONS[index].role}{" "}
                    <span style={{ color: colors.HIGHLIGHT }}>
                      @ {COMPANIES[index]}
                    </span>
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
      </Container>
    </>
  );
};

export default Work;
