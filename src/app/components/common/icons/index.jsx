import {
  HiOutlineAcademicCap,
  HiOutlineArrowDownTray,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineBookOpen,
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
  HiOutlineClipboardDocumentList,
  HiOutlineCheck,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineComputerDesktop,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineFunnel,
  HiOutlineHome,
  HiOutlineMagnifyingGlass,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineXMark,
} from 'react-icons/hi2'

export {
  HiOutlineAcademicCap as IconAcademicCap,
  HiOutlineArrowDownTray as IconDownload,
  HiOutlineArrowRightOnRectangle as IconLogout,
  HiOutlineBars3 as IconMenu,
  HiOutlineBookOpen as IconBookOpen,
  HiOutlineBuildingOffice2 as IconBuilding,
  HiOutlineCalendarDays as IconCalendar,
  HiOutlineCheck as IconCheck,
  HiOutlineChevronLeft as IconChevronLeft,
  HiOutlineChevronRight as IconChevronRight,
  HiOutlineComputerDesktop as IconComputer,
  HiOutlineEye as IconEye,
  HiOutlineEyeSlash as IconEyeSlash,
  HiOutlineFunnel as IconFilters,
  HiOutlineHome as IconHome,
  HiOutlineMagnifyingGlass as IconSearch,
  HiOutlineMinus as IconMinus,
  HiOutlinePlus as IconPlus,
  HiOutlinePencil as IconPencil,
  HiOutlineTrash as IconTrash,
  HiOutlineXMark as IconClose,
}

const NAV_ICON_MAP = {
  home: HiOutlineHome,
  cubicle: HiOutlineBuildingOffice2,
  equipment: HiOutlineComputerDesktop,
  tutoring: HiOutlineAcademicCap,
  'my-tutorings': HiOutlineBookOpen,
  reservations: HiOutlineCalendarDays,
  'my-equipment': HiOutlineClipboardDocumentList,
}

export function NavIcon({ name, className = 'size-5 shrink-0' }) {
  const Icon = NAV_ICON_MAP[name]
  if (!Icon) return null
  return <Icon className={className} aria-hidden />
}

export function IconChevron({ direction, className = 'size-5' }) {
  const Icon = direction === 'left' ? HiOutlineChevronLeft : HiOutlineChevronRight
  return <Icon className={className} aria-hidden />
}
