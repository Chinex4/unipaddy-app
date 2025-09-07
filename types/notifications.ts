export type Notice = {
  id: string;
  title: string;
  body: string;
  time: string;      // "11:56pm"
  read?: boolean;
};

export const noticesSeed: Notice[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `n${i + 1}`,
  title: "School Announcement",
  time: "11:56pm",
  body:
    "Lorem ipsum dolor sit amet consectetur. Posuere velit tristique vestibulum sit ut in sed vitae. " +
    "Nulla nunc ultrices ut non elementum maecenas vestibulum. At auctor sed in eget amet. " +
    "Enim aliquam nisl nullam metus scelerisque. Diam quam sed semper non est pharetra.\n\n" +
    "Tortor mauris lectus egestas sit arcu. Lectus tortor in eu blandit scelerisque tincidunt quam. " +
    "Facilisis porta ullamcorper sit elit. Lectus nisl ac auctor velit scelerisque.",
  read: i % 2 === 0,
}));
