"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getStudentData } from "@/lib/mock-data"
import { CreditCard, Home, User, Users } from "lucide-react"

// Mock fee data
const feeData = {
  tuitionFee: 45000,
  hostelFee: 35000,
  messFee: 25000,
  otherFees: 5000,
  totalFee: 110000,
  paidAmount: 75000,
  dueAmount: 35000,
  dueDate: "2024-07-15",
  installments: [
    { id: 1, name: "First Installment", amount: 55000, status: "Paid", dueDate: "2024-01-15", paidDate: "2024-01-10" },
    { id: 2, name: "Second Installment", amount: 20000, status: "Paid", dueDate: "2024-04-15", paidDate: "2024-04-12" },
    { id: 3, name: "Final Installment", amount: 35000, status: "Pending", dueDate: "2024-07-15", paidDate: null },
  ],
  transactions: [
    {
      id: "TXN001",
      amount: 55000,
      date: "2024-01-10",
      method: "Online Banking",
      status: "Success",
      receiptNo: "REC001",
    },
    { id: "TXN002", amount: 20000, date: "2024-04-12", method: "Credit Card", status: "Success", receiptNo: "REC002" },
  ],
}

export default function FeesPage() {
  const [studentData, setStudentData] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCvv] = useState("")
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      const data = getStudentData(email)
      setStudentData(data)
    }
  }, [])

  const handlePayment = () => {
    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        toast({
          title: "Missing Information",
          description: "Please fill in all card details.",
          variant: "destructive",
        })
        return
      }

      if (cardNumber.length < 16) {
        toast({
          title: "Invalid Card Number",
          description: "Please enter a valid card number.",
          variant: "destructive",
        })
        return
      }
    }

    setShowPaymentSuccess(true)
  }

  const downloadReceipt = (receiptNo: string) => {
    toast({
      title: "Receipt Downloaded",
      description: `Receipt ${receiptNo} has been downloaded.`,
    })
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/student" },
    { icon: User, label: "Profile", href: "/dashboard/student/profile" },
    { icon: Home, label: "Room Info", href: "/dashboard/student/room" },
    { icon: Users, label: "Complaints", href: "/dashboard/student/complaints" },
    { icon: Users, label: "Leave Applications", href: "/dashboard/student/leave" },
    { icon: CreditCard, label: "Fee Management", href: "/dashboard/student/fees", active: true },
    { icon: Users, label: "Attendance", href: "/dashboard/student/attendance" },
    { icon: Users, label: "Health Records", href: "/dashboard/student/health" },
    { icon: Users, label: "Food Menu", href: "/dashboard/student/food" },
    { icon: Users, label: "Notifications", href: "/dashboard/student/notifications" },
  ]

  if (!studentData) {
    return <div>Loading...</div>
  }

  const paidPercentage = (feeData.paidAmount / feeData.totalFee) * 100

  return (
    <DashboardLayout menuItems={menuItems} userRole="student" userName={studentData.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fee Management</h1>
          <p className="text-gray-600">View and pay your hostel and tuition fees</p>
        </div>

        {/* Fee Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-green-600 mb-2">₹{feeData.paidAmount.toLocaleString()}</div>
                <p className="text-gray-600 mb-1">Amount Paid</p>
                <div className="mt-4 w-full">
                  <Progress value={paidPercentage} className="h-2" />
                </div>
                <p className="mt-2 text-sm text-gray-600">{paidPercentage.toFixed(0)}% of total fees paid</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-red-600 mb-2">₹{feeData.dueAmount.toLocaleString()}</div>
                <p className="text-gray-600 mb-1">Amount Due</p>
                <p className="text-sm text-gray-500">Due Date: {feeData.dueDate}</p>
                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Pay Now</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Pay Fees</DialogTitle>
                        <DialogDescription>Make a payment for your pending fees.</DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Payment Amount</h4>
                          <div className="text-2xl font-bold">₹{feeData.dueAmount.toLocaleString()}</div>
                          <p className="text-sm text-gray-500">Final Installment</p>
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Method</Label>
                          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="card" id="card" />
                              <Label htmlFor="card">Credit/Debit Card</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="netbanking" id="netbanking" />
                              <Label htmlFor="netbanking">Net Banking</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="upi" id="upi" />
                              <Label htmlFor="upi">UPI</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {paymentMethod === "card" && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <Label htmlFor="card-number">Card Number</Label>
                              <Input
                                id="card-number"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="card-name">Name on Card</Label>
                              <Input
                                id="card-name"
                                placeholder="John Doe"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input
                                  id="expiry"
                                  placeholder="MM/YY"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                  id="cvv"
                                  placeholder="123"
                                  value={cardCvv}
                                  onChange={(e) => setCvv(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentMethod === "netbanking" && (
                          <div className="space-y-3">
                            <p className="text-sm text-gray-600">
                              You will be redirected to your bank's website to complete the payment.
                            </p>
                          </div>
                        )}

                        {paymentMethod === "upi" && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <Label htmlFor="upi-id">UPI ID</Label>
                              <Input id="upi-id" placeholder="name@upi" />
                            </div>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button onClick={handlePayment}>Pay ₹{feeData.dueAmount.toLocaleString()}</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">₹{feeData.totalFee.toLocaleString()}</div>
                <p className="text-gray-600 mb-1">Total Fees</p>
                <div className="mt-4 space-y-2 w-full">
                  <div className="flex justify-between text-sm">
                    <span>Tuition Fee</span>
                    <span>₹{feeData.tuitionFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Hostel Fee</span>
                    <span>₹{feeData.hostelFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mess Fee</span>
                    <span>₹{feeData.messFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Other Fees</span>
                    <span>₹{feeData.otherFees.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fee Breakdown */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fee Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-blue-600">Tuition Fee</h4>
                <p className="text-2xl font-bold">₹{feeData.tuitionFee.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Academic fees</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-green-600">Hostel Fee</h4>
                <p className="text-2xl font-bold">₹{feeData.hostelFee.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Accommodation</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-orange-600">Mess Fee</h4>
                <p className="text-2xl font-bold">₹{feeData.messFee.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Food & dining</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-purple-600">Other Fees</h4>
                <p className="text-2xl font-bold">₹{feeData.otherFees.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Miscellaneous</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Installment Status */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Installment Status</h3>
            <div className="space-y-4">
              {feeData.installments.map((installment) => (
                <div key={installment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{installment.name}</h4>
                    <p className="text-sm text-gray-600">Due: {installment.dueDate}</p>
                    {installment.paidDate && <p className="text-sm text-green-600">Paid: {installment.paidDate}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{installment.amount.toLocaleString()}</p>
                    {installment.status === "Paid" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Payment History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Transaction ID</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Method</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {feeData.transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="py-3">{transaction.id}</td>
                      <td className="py-3">{transaction.date}</td>
                      <td className="py-3">₹{transaction.amount.toLocaleString()}</td>
                      <td className="py-3">{transaction.method}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <Button variant="outline" size="sm" onClick={() => downloadReceipt(transaction.receiptNo)}>
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payment Success Dialog */}
        <Dialog open={showPaymentSuccess} onOpenChange={setShowPaymentSuccess}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment Successful!</DialogTitle>
              <DialogDescription>Your payment has been processed successfully.</DialogDescription>
            </DialogHeader>
            <div className="py-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Payment Completed</h3>
              <p className="text-gray-600 mb-4">Amount: ₹{feeData.dueAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Transaction ID: TXN{Math.floor(Math.random() * 1000)}</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowPaymentSuccess(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
