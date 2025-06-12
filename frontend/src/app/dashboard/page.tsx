"use client"
// import { useNotification, notify } from "@/components/custom-notification/notification"

export default function DashboardPage() {
  // const { addNotification } = useNotification()

  // const handleTestNotification = (type: "success" | "error" | "warning" | "info") => {
  //   const notifications = {
  //     success: notify.success("Success!", "This is a success notification"),
  //     error: notify.error("Error!", "This is an error notification"),
  //     warning: notify.warning("Warning!", "This is a warning notification"),
  //     info: notify.info("Info!", "This is an info notification"),
  //   }

  //   addNotification(notifications[type])
  // }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome to your medical management dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">1,248</p>
          <p className="text-sm text-green-600 dark:text-green-400">+12% from last month</p>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Appointments Today</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">6 pending</p>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">New Patients</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
          <p className="text-sm text-orange-600 dark:text-orange-400">This week</p>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">$24,500</p>
          <p className="text-sm text-green-600 dark:text-green-400">+8% from last month</p>
        </div>
      </div>

      {/* Test Notifications */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Test Notifications</h3>
        <div className="flex flex-wrap gap-2">
          {/* <button
            onClick={() => handleTestNotification("success")}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Success
          </button>
          <button
            onClick={() => handleTestNotification("error")}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Error
          </button>
          <button
            onClick={() => handleTestNotification("warning")}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            Warning
          </button>
          <button
            onClick={() => handleTestNotification("info")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Info
          </button> */}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Appointments</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Patient</th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Date</th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Time</th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 text-sm text-gray-900 dark:text-white">John Doe</td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">Today</td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">10:00 AM</td>
                <td className="py-3">
                  <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs text-green-800 dark:text-green-300">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 text-sm text-gray-900 dark:text-white">Jane Smith</td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">Today</td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">11:30 AM</td>
                <td className="py-3">
                  <span className="rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-1 text-xs text-blue-800 dark:text-blue-300">
                    In Progress
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 text-sm text-gray-900 dark:text-white">Robert Johnson</td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">Today</td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">2:00 PM</td>
                <td className="py-3">
                  <span className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 text-xs text-yellow-800 dark:text-yellow-300">
                    Waiting
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-sm text-gray-900 dark:text-white">Emily Davis</td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">Today</td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">3:30 PM</td>
                <td className="py-3">
                  <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs text-gray-800 dark:text-gray-300">
                    Scheduled
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
