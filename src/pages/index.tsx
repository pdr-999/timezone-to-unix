import Head from "next/head";
import { Inter } from "next/font/google";
import {
  ActionIcon,
  Container,
  CopyButton,
  Grid,
  Select,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { timezones } from "@/utils/timezones";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEffect, useState } from "react";
import {
  DateInput,
  DateTimePicker,
  DateValue,
  DatesProvider,
} from "@mantine/dates";
import { IconCopy, IconCopyCheck } from "@tabler/icons-react";

dayjs.extend(utc);
dayjs.extend(timezone);

type Tz = (typeof timezones)[0];

const timezoneMap = new Map<string, Tz>(
  timezones.map((tz) => [tz.timezone, tz])
);

const timezoneIdMap = new Map<
  string,
  { city: string; timezone: string; utc: string }
>([...timezoneMap].map(([label, tz]) => [tz.id, { ...tz }]));

export default function Home() {
  const [dateTime, setDateTime] = useState<DateValue>(null);
  const [tzId, setTzId] = useState<string | null>(null);

  useEffect(() => {
    const tz = timezoneMap.get(dayjs.tz.guess());

    if (tz) {
      setTzId(tz.id);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Timezone To Local or Discord</title>
        <meta
          name="description"
          content="Convert timezone to local time or discord timestamp"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Space h={"md"} />

        <Text size="xl">Timezone to unix</Text>
        <Text>Convert timezone to local time or discord timestamp</Text>
        <Space h={"xl"} />

        <Grid>
          <Grid.Col span={6}>
            <Text size="lg">Input</Text>

            <Select
              onChange={setTzId}
              value={tzId}
              label="Timezone"
              placeholder="Pick value"
              data={[...timezoneMap].map(([label, tz]) => ({
                label: label.replace("_", " ") + ", " + tz.utc,
                value: tz.id,
              }))}
              searchable
            />
            <Space h={"md"} />

            <DatesProvider
              settings={{
                timezone: timezoneIdMap.get(tzId ?? "")?.timezone ?? "",
              }}
            >
              <DateTimePicker
                onChange={setDateTime}
                value={dateTime}
                label="Pick date and time"
                valueFormat="DD MMM YYYY hh:mm A"
              />
            </DatesProvider>
          </Grid.Col>

          <Grid.Col span={6}>
            <Text size="lg">Output</Text>

            <TextInput
              label="Discord"
              variant="unstyled"
              value={`<t:${dayjs(dateTime).unix()}:F>`}
              readOnly
              style={{
                borderBottom: "1px solid gray",
              }}
              placeholder="Discord format"
              rightSection={
                <CopyButton value="https://mantine.dev">
                  {({ copied, copy }) => (
                    <ActionIcon
                      color={copied ? "blue" : "blue"}
                      variant={copied ? "filled" : "outline"}
                      onClick={copy}
                    >
                      {copied ? (
                        <IconCopyCheck size={"1rem"} />
                      ) : (
                        <IconCopy size={"1rem"} />
                      )}
                    </ActionIcon>
                  )}
                </CopyButton>
              }
            />
            <Space h={"md"} />

            <DatesProvider settings={{ timezone: dayjs.tz.guess() }}>
              <DateInput
                label="Your local time"
                variant="unstyled"
                readOnly
                value={dateTime}
                placeholder="Pick date and time"
                valueFormat="DD MMM YYYY hh:mm A"
              />
            </DatesProvider>
          </Grid.Col>
        </Grid>

        <Space h={"md"}></Space>
      </Container>
    </>
  );
}
