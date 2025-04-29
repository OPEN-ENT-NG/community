import { useEffect, useMemo } from "react";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import {
  COMMUNITY_YEARS_SUBSTRACTION,
  MAX_COMMUNITY_YEARS_LENGTH,
} from "~/config/constants";
import { CommunityParams } from "~/models/community";

interface UseAcademicYearsProps {
  watch: UseFormWatch<CommunityParams>;
  setValue: UseFormSetValue<CommunityParams>;
  startFieldName?: keyof CommunityParams;
  endFieldName?: keyof CommunityParams;
}

export default function useDataListYears({
  watch,
  setValue,
  startFieldName = "startYear",
  endFieldName = "endYear",
}: UseAcademicYearsProps) {
  const baseYear = new Date().getFullYear() - COMMUNITY_YEARS_SUBSTRACTION;

  const startYears = useMemo(
    () =>
      Array.from({ length: MAX_COMMUNITY_YEARS_LENGTH }, (_, i) =>
        (baseYear + i).toString()
      ),
    [baseYear]
  );

  const rawStart = watch(startFieldName);
  const startYear =
    rawStart && startYears.includes(rawStart) ? rawStart : startYears[0];

  const lastYearNum = parseInt(startYears[startYears.length - 1], 10);
  const endYears = useMemo(
    () =>
      Array.from(
        { length: lastYearNum - parseInt(startYear, 10) + 1 },
        (_, i) => (parseInt(startYear, 10) + i).toString()
      ),
    [startYear, lastYearNum]
  );

  const rawEnd = watch(endFieldName);
  const endYear = rawEnd && endYears.includes(rawEnd) ? rawEnd : endYears[0];

  useEffect(() => {
    if (!rawStart || !startYears.includes(rawStart)) {
      setValue(startFieldName, startYear);
    }
  }, [rawStart, startYear, setValue, startFieldName, startYears]);

  useEffect(() => {
    if (
      !rawEnd ||
      !endYears.includes(rawEnd) ||
      parseInt(rawEnd, 10) < parseInt(startYear, 10)
    ) {
      setValue(endFieldName, endYear);
    }
  }, [rawEnd, endYear, startYear, setValue, endFieldName, endYears]);

  return { startYears, endYears, startYear, endYear };
}
