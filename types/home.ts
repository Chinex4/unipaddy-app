import {
  Receipt,
  BookOpen,
  GraduationCap,
  CalendarCheck2,
  Settings2,
  Sparkles,
  UserRound,
  ClipboardList,
  LucideIcon,
} from "lucide-react-native";

/** TYPES */
export type QuickAction = {
  key: string;
  label: string;
  icon: LucideIcon;
  route?: string;
};

export type CampusUpdate = {
  id: string;
  image: string;
  title: string;
  snippet: string;
};

export type Activity = {
  id: string;
  badge: string; // initials inside the gray circle (e.g., DP, AS)
  title: string;
  subtitle: string;
  amount?: number | null; // negative = debit, positive = credit
  status?: "Successful" | "Failed" | "Pending";
  meta: string; // time/day
};

/** MOCK DATA */
export const quickActions: QuickAction[] = [
  { key: "dues", label: "Dues", icon: Receipt, route: "/dues" },
  { key: "books", label: "Books", icon: BookOpen, route: "/books" },
  { key: "cgpa", label: "CGPA", icon: UserRound, route: "/coming-soon" },
  {
    key: "attendance",
    label: "Attendance",
    icon: Settings2,
    route: "/coming-soon",
  },

  { key: "message", label: "Dues", icon: ClipboardList, route: "/coming-soon" },
  { key: "spark", label: "Dues", icon: Sparkles, route: "/coming-soon" },
  { key: "grade", label: "Dues", icon: GraduationCap, route: "/coming-soon" },
  { key: "more", label: "Dues", icon: CalendarCheck2, route: "/coming-soon" },
];

export const campusUpdates: CampusUpdate[] = [
  {
    id: "u1",
    image:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1200&auto=format&fit=crop",
    title: "Article  Header 1",
    snippet:
      "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur.",
  },
  {
    id: "u2",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    title: "Article  Header 1",
    snippet:
      "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur.",
  },
];

export const recentActivities: Activity[] = [
  {
    id: "a1",
    badge: "DP",
    title: "Dues Payment",
    subtitle: "SUG Dues",
    amount: -1500.0,
    meta: "Today",
  },
  {
    id: "a2",
    badge: "AS",
    title: "Attendance Sheet",
    subtitle: "Today",
    status: "Successful",
    amount: null,
    meta: "Today",
  },
];
