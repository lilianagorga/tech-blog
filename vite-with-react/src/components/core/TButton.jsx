import { Link } from "react-router-dom";

export default function TButton({color = "indigo", to = "", circle = false, square = false, squareMedium = false, href = "", link = false, target = "_blank", onClick = () => {}, children,})
{
  let classes = [
    "flex",
    "items-center",
    "whitespace-nowrap",
    "text-sm",
    "border",
    "border-2",
    "border-transparent",
    "my-2",
    "w-auto",
  ];

  if (link) {
    classes = [...classes, "transition-colors"];

    switch (color) {
      case "indigo":
        classes = [...classes, "text-indigo-500", "focus:border-indigo-500"];
        break;
      case "red":
        classes = [...classes, "text-red-500", "focus:border-red-500"];
    }
  } else {
    classes = [...classes, "text-white", "focus:ring-2", "focus:ring-offset-2"];

    switch (color) {
      case "indigo":
        classes = [
          ...classes,
          "bg-indigo-600",
          "hover:bg-indigo-700",
          "focus:ring-indigo-500",
        ];
        break;
      case "red":
        classes = [
          ...classes,
          "bg-red-600",
          "hover:bg-red-700",
          "focus:ring-red-500",
        ];
        break;
      case "green":
        classes = [
          ...classes,
          "bg-emerald-500",
          "hover:bg-emerald-600",
          "focus:ring-emerald-400",
        ];
        break;
    }
  }

  if (circle) {
    classes = [
      ...classes,
      "h-8",
      "w-8",
      "items-center",
      "justify-center",
      "rounded-full",
      "text-sm",
    ];
  } else if (square) {
    classes = [
      ...classes,
      "h-custom",
      "w-custom",
      "items-center",
      "justify-center",
      "rounded",
      "text-sm"
    ]
  } else if (squareMedium) {
    classes = [
      ...classes,
      "h-8",
      "w-10",
      "items-center",
      "justify-center",
      "rounded",
      "text-sm",
    ]
  } else {
    classes = [...classes, "p-0", "py-2", "px-4", "rounded-md"];
  }



  return (
    <>
      {href && (
        <a href={href} className={classes.join(" ")} target={target}>
          {children}
        </a>
      )}
      {to && (
        <Link to={to} className={classes.join(" ")}>
          {children}
        </Link>
      )}
      {!to && !href && (
        <button onClick={onClick} className={classes.join(" ")}>{children}</button>
      )}
    </>
  );
}
