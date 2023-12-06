import { by } from "../util/by.ts";

type Mapping = {
  destinationStart: number;
  sourceStart: number;
  rangeLength: number;
};

type Range = Omit<Mapping, "destinationStart">;

type Almanac = {
  seeds: number[];
  maps: Array<{
    source: string;
    destination: string;
    mappings: Mapping[];
  }>;
};

function part1(almanac: Almanac) {
  let source = Array.from(almanac.seeds);

  const mapSourceToDestination = (mappings: Mapping[]) => (source: number) => {
    const mapping = mappings.find(
      ({ sourceStart, rangeLength }) =>
        source >= sourceStart && source <= sourceStart + rangeLength
    );

    if (!mapping) {
      return source;
    }

    const difference = source - mapping.sourceStart;
    return mapping.destinationStart + difference;
  };

  for (const map of almanac.maps) {
    source = source.map(mapSourceToDestination(map.mappings));
  }

  return Math.min(...source);
}

function part2(almanac: Almanac) {
  let sourceRanges: Range[] = by(2, almanac.seeds).map(
    ([sourceStart, rangeLength]) => ({
      sourceStart,
      rangeLength,
    })
  );

  const mapSourceRangeToDestinationRanges =
    (mappings: Mapping[]) =>
    (sourceRange: Range): Range[] => {
      const removeOverlap = (range: Range, overlap: Range): Range[] => {
        const rangeEnd = range.sourceStart + (range.rangeLength - 1);
        const overlapEnd = overlap.sourceStart + (overlap.rangeLength - 1);

        const nonOverlap1 = {
          sourceStart: range.sourceStart,
          rangeLength: overlap.sourceStart - range.sourceStart,
        };

        const nonOverlap2 = {
          sourceStart: overlapEnd + 1,
          rangeLength: rangeEnd - overlapEnd,
        };

        const result = [nonOverlap1, nonOverlap2].filter(
          (range) => range.rangeLength > 0
        );

        return result;
      };

      const findOverlap = (range: Range) => {
        const mappingEnd = range.sourceStart + (range.rangeLength - 1);
        const sourceEnd =
          sourceRange.sourceStart + (sourceRange.rangeLength - 1);

        const overlapStart = Math.max(
          range.sourceStart,
          sourceRange.sourceStart
        );
        const overlapEnd = Math.min(mappingEnd, sourceEnd);
        const overlapLength = overlapEnd - overlapStart + 1;

        if (overlapLength <= 0) {
          return null;
        }

        return { sourceStart: overlapStart, rangeLength: overlapLength };
      };

      const overlappingMappings = mappings.flatMap((m) => {
        const overlap = findOverlap(m);

        if (!overlap) {
          return [];
        }

        const destinationRange: Range = {
          ...overlap,
          sourceStart:
            m.destinationStart + (overlap.sourceStart - m.sourceStart),
        };

        if (
          overlap.sourceStart === sourceRange.sourceStart &&
          overlap.rangeLength === sourceRange.rangeLength
        ) {
          return destinationRange;
        }

        return [...removeOverlap(sourceRange, overlap), destinationRange];
      });

      if (!overlappingMappings.length) {
        return [sourceRange];
      }

      return overlappingMappings;
    };

  /*
    Water

    (81, 14); (57, 13)
    ****

    (57, 13) = 57 -> 69
    (49, 53, 8) = 53 -> 60
    overlap 57 -> 60 = (57, 4)
    destination = (49 + (57 - 53), 4) = (53, 4)

    61 -> 69 = (61, 9)

    ---
    (57, 13) = 57 -> 69
    (0, 11, 42) = 11 -> 52

    Temp

    (74, 14) = 74 -> 87
    (45, 77, 23) = 77 -> 99
    overlap = 77 -> 87 = (77, 11)
    destination = (45 + (77 - 77), 11) = (45, 11)

    non overlap = 74 -> 76 = (74, 3)


    74 -> 76
    45 -> 55
    (77, 11) = 77 -> 87
    78 -> 80
    [x] (90, 9)
    [x] (82, 4)
    
  */

  console.log({ sourceRanges });

  for (const map of almanac.maps) {
    sourceRanges = sourceRanges.flatMap(
      mapSourceRangeToDestinationRanges(map.mappings)
    );
    console.log({ ...map, sourceRanges });
  }

  return Math.min(...sourceRanges.map((r) => r.sourceStart));
}

export function solve() {
  const text = Deno.readTextFileSync("inputs/day5.test.txt");
  const [seedsText, ...mapsText] = text.split("\n\n");

  const seeds = seedsText.replace("seeds: ", "").split(" ").map(Number);
  const maps = mapsText.map((mapText) => {
    const [title, ...mappingTexts] = mapText.split("\n").filter(Boolean);
    const [source, destination] = title.replace(" map:", "").split("-to-");

    const mappings = mappingTexts.map((mappingText) => {
      const [destinationStart, sourceStart, rangeLength] = mappingText
        .split(" ")
        .map(Number);
      return { destinationStart, sourceStart, rangeLength };
    });

    return { source, destination, mappings };
  });

  const almanac = { seeds, maps };
  return `Part 1: ${part1(almanac)}\nPart 2: ${part2(almanac)}`;
}
