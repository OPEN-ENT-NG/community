import { useEffect, useMemo } from "react";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import {
  COMMUNITY_YEARS_SUBSTRACTION,
  MAX_COMMUNITY_YEARS_LENGTH,
} from "~/config/constants";
import { CommunityParams } from "~/models/community";

interface DataListYears {
  watch: UseFormWatch<CommunityParams>;
  setValue: UseFormSetValue<CommunityParams>;
}

export default function useDataListYears({ watch, setValue }: DataListYears) {
  const baseYear = new Date().getFullYear() - COMMUNITY_YEARS_SUBSTRACTION;

  // Generate years from the base year to the maximum length
  const startYears = useMemo(
    () =>
      Array.from({ length: MAX_COMMUNITY_YEARS_LENGTH }, (_, i) =>
        (baseYear + i).toString()
      ),
    [baseYear]
  );

  const rawStart = watch("startYear");
  const startYear =
    rawStart && startYears.includes(rawStart) ? rawStart : startYears[0];

  // Calculate the last year number based on the last element of startYears
  const lastYearNum = parseInt(startYears[startYears.length - 1], 10);

  // Generate end years from the start year to the last year number
  const endYears = useMemo(
    () =>
      Array.from(
        { length: lastYearNum - parseInt(startYear, 10) + 1 },
        (_, i) => (parseInt(startYear, 10) + i).toString()
      ),
    [startYear, lastYearNum]
  );

  const rawEnd = watch("endYear");

  // Set the end year to the last element of endYears if rawEnd is not valid
  const endYear = rawEnd && endYears.includes(rawEnd) ? rawEnd : endYears[0];

  // Set default values for start and end years if they are not valid
  useEffect(() => {
    if (!rawStart || !startYears.includes(rawStart)) {
      setValue("startYear", startYear);
    }
  }, [rawStart, startYear, setValue, startYears]);

  // Set default value for end year if it is not valid or less than start year
  useEffect(() => {
    if (
      !rawEnd ||
      !endYears.includes(rawEnd) ||
      parseInt(rawEnd, 10) < parseInt(startYear, 10)
    ) {
      setValue("endYear", endYear);
    }
  }, [rawEnd, endYear, startYear, setValue, endYears]);

  return { startYears, endYears, startYear, endYear };
}
