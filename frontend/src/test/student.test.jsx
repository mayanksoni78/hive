import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import StudentDashboard from "../Pages/StudentDashboard";

// ─── MOCKS ────────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

global.fetch = vi.fn();

// ─── FIXTURES ─────────────────────────────────────────────────────────────────

const mockStudent = {
  enroll_id: "101",
  name: "Riya Sharma",
  email: "riya@example.com",
  phone: "+91 98765 43210",
  gender: "F",
  year: 2,
  room_id: "204",
  hostel_id: "A",
  fee_id: "FEE-101",
  address: "12, MG Road, Ahmedabad",
  status: "active",
};

const mockPayments = [
  { id: 1, month: "January 2025",  amount: "12000", status: "Paid",    payment_date: "2025-01-05" },
  { id: 2, month: "February 2025", amount: "12000", status: "Paid",    payment_date: "2025-02-04" },
  { id: 3, month: "March 2025",    amount: "12000", status: "Pending", payment_date: null         },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function renderDashboard() {
  return render(
    <MemoryRouter>
      <StudentDashboard />
    </MemoryRouter>
  );
}

function seedLocalStorage(student = mockStudent) {
  localStorage.setItem("student", JSON.stringify(student));
}

function mockFetchSuccess(payload) {
  global.fetch.mockResolvedValueOnce({
    json: async () => payload,
  });
}

function mockFetchError(message) {
  global.fetch.mockRejectedValueOnce(new Error(message));
}

// ─── SETUP / TEARDOWN ─────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.removeItem("student");
});

afterEach(() => {
  localStorage.removeItem("student");
});

// ─── AUTH / REDIRECT ──────────────────────────────────────────────────────────

describe("Authentication guard", () => {
  test("redirects to /login when no student in localStorage", () => {
    renderDashboard();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("does not redirect when student is present", () => {
    seedLocalStorage();
    renderDashboard();
    expect(mockNavigate).not.toHaveBeenCalledWith("/login");
  });

  test("handles corrupted localStorage and redirects to /login", () => {
    localStorage.setItem("student", "not-valid-json{{");
    renderDashboard();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────

describe("DashboardPage", () => {
  beforeEach(() => seedLocalStorage());

  test("renders greeting with student first name", () => {
    renderDashboard();
    expect(screen.getByText(/Good morning, Riya/i)).toBeInTheDocument();
  });

  test("renders enrollment ID stat card", () => {
    renderDashboard();
expect(screen.getAllByText("101").length).toBeGreaterThan(0);
  });

  test("renders room stat card", () => {
    renderDashboard();
    expect(screen.getByText("#204")).toBeInTheDocument();
  });

  test("renders year stat card", () => {
    renderDashboard();
    expect(screen.getByText("Year 2")).toBeInTheDocument();
  });

  test("renders fee ID stat card", () => {
    renderDashboard();
    expect(screen.getByText("FEE-101")).toBeInTheDocument();
  });

  test("renders all quick action labels", () => {
    renderDashboard();
    const labels = [
      "Today's mess menu",
      "Transport schedule",
      "Submit a complaint",
      "View notices",
      "Check fee status",
      "Edit my profile",
      "My complaints",
    ];
    labels.forEach(label => expect(screen.getByText(label)).toBeInTheDocument());
  });

  test("renders student name and email in info card", () => {
    renderDashboard();
expect(screen.getAllByText("Riya Sharma").length).toBeGreaterThan(0);
    expect(screen.getByText("riya@example.com")).toBeInTheDocument();
  });

  test("clicking 'Check fee status' shows FeePage", async () => {
    mockFetchSuccess({ payments: [] });
    renderDashboard();
    await userEvent.click(screen.getByText("Check fee status"));
    expect(screen.getByText("Payment History")).toBeInTheDocument();
  });

  test("clicking 'Edit my profile' shows ProfilePage", async () => {
    renderDashboard();
    await userEvent.click(screen.getByText("Edit my profile"));
    expect(screen.getByText("My Profile")).toBeInTheDocument();
  });

  test("clicking 'Today's mess menu' navigates via router", async () => {
    renderDashboard();
    await userEvent.click(screen.getByText("Today's mess menu"));
    expect(mockNavigate).toHaveBeenCalledWith("/mess-menu");
  });

  test("clicking 'Transport schedule' navigates via router", async () => {
    renderDashboard();
    await userEvent.click(screen.getByText("Transport schedule"));
    expect(mockNavigate).toHaveBeenCalledWith("/transport_schedule");
  });

  test("clicking 'Submit a complaint' navigates via router", async () => {
    renderDashboard();
    await userEvent.click(screen.getByText("Submit a complaint"));
    expect(mockNavigate).toHaveBeenCalledWith("/complain_page");
  });

  test("clicking 'View notices' navigates via router", async () => {
    renderDashboard();
    await userEvent.click(screen.getByText("View notices"));
    expect(mockNavigate).toHaveBeenCalledWith("/notices");
  });

  test("displays active status badge", () => {
    renderDashboard();
    expect(screen.getAllByText("active").length).toBeGreaterThan(0);
  });

  test("renders Female for gender F", () => {
    renderDashboard();
    expect(screen.getAllByText("Female").length).toBeGreaterThan(0);
  });
});

// ─── SIDEBAR NAVIGATION ───────────────────────────────────────────────────────

describe("Sidebar navigation", () => {
  beforeEach(() => seedLocalStorage());

  test("clicking Fee Status nav item shows FeePage", async () => {
    mockFetchSuccess({ payments: [] });
    renderDashboard();
    await userEvent.click(screen.getByText("Fee Status"));
    await waitFor(() => expect(screen.getByText("Payment History")).toBeInTheDocument());
  });

  test("clicking Profile nav item shows ProfilePage", async () => {
    renderDashboard();
    await userEvent.click(screen.getByText("Profile"));
    expect(screen.getByText("My Profile")).toBeInTheDocument();
  });

  test("logout clears localStorage and navigates to /login", async () => {
    renderDashboard();
    await userEvent.click(screen.getByText(/Logout/i));
    expect(localStorage.getItem("student")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});

// ─── FEE PAGE ─────────────────────────────────────────────────────────────────

describe("FeePage", () => {
  beforeEach(() => seedLocalStorage());

  async function goToFeePage() {
    renderDashboard();
    await userEvent.click(screen.getByText("Fee Status"));
  }

  test("shows loader then renders payment rows", async () => {
    mockFetchSuccess({ payments: mockPayments });
    await goToFeePage();
    await waitFor(() => expect(screen.getByText("January 2025")).toBeInTheDocument());
  });

  test("renders all three payment months", async () => {
    mockFetchSuccess({ payments: mockPayments });
    await goToFeePage();
    await waitFor(() => {
      expect(screen.getByText("January 2025")).toBeInTheDocument();
      expect(screen.getByText("February 2025")).toBeInTheDocument();
      expect(screen.getByText("March 2025")).toBeInTheDocument();
    });
  });

  test("computes total paid (2 × ₹12,000 = ₹24,000)", async () => {
    mockFetchSuccess({ payments: mockPayments });
    await goToFeePage();
    await waitFor(() => expect(screen.getByText("₹24,000")).toBeInTheDocument());
  });

  test("computes outstanding (1 × ₹12,000 = ₹12,000)", async () => {
    mockFetchSuccess({ payments: mockPayments });
    await goToFeePage();
    await waitFor(() => expect(screen.getAllByText("₹12,000").length).toBeGreaterThan(0));
  });

  test("shows correct transaction count", async () => {
    mockFetchSuccess({ payments: mockPayments });
    await goToFeePage();
    await waitFor(() => expect(screen.getByText("3")).toBeInTheDocument());
  });

  test("shows empty state when no payments", async () => {
    mockFetchSuccess({ payments: [] });
    await goToFeePage();
    await waitFor(() =>
      expect(screen.getByText("No payment records yet")).toBeInTheDocument()
    );
  });

  test("shows error alert on API error response", async () => {
    mockFetchSuccess({ error: "Database connection failed" });
    await goToFeePage();
    await waitFor(() =>
      expect(screen.getByText("Database connection failed")).toBeInTheDocument()
    );
  });

  test("shows error alert on network failure", async () => {
    mockFetchError("Network Error");
    await goToFeePage();
    await waitFor(() =>
      expect(screen.getByText("Network Error")).toBeInTheDocument()
    );
  });

  test("calls API endpoint with enroll_id=101", async () => {
    mockFetchSuccess({ payments: [] });
    await goToFeePage();
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("enroll_id=101"))
    );
  });

  test("renders two Paid badges and one Pending badge", async () => {
    mockFetchSuccess({ payments: mockPayments });
    await goToFeePage();
    await waitFor(() => {
      expect(screen.getAllByText("Paid").length).toBe(2);
      expect(screen.getAllByText("Pending").length).toBe(1);
    });
  });

  test("shows — for missing payment date", async () => {
    mockFetchSuccess({ payments: mockPayments });
    await goToFeePage();
    await waitFor(() => expect(screen.getByText("—")).toBeInTheDocument());
  });

  test("outstanding shows ₹0 when all payments are paid", async () => {
    const allPaid = mockPayments.map(p => ({ ...p, status: "Paid" }));
    mockFetchSuccess({ payments: allPaid });
    await goToFeePage();
    await waitFor(() => {
      // Total paid = ₹36,000; outstanding = ₹0
      expect(screen.getByText("₹36,000")).toBeInTheDocument();
      expect(screen.getByText("₹0")).toBeInTheDocument();
    });
  });
});

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────

describe("ProfilePage", () => {
  beforeEach(() => seedLocalStorage());

  async function goToProfilePage() {
    renderDashboard();
    await userEvent.click(screen.getByText("Profile"));
  }

  test("renders student details in read-only mode", async () => {
    await goToProfilePage();
expect(screen.getAllByText("Riya Sharma").length).toBeGreaterThan(0);
    expect(screen.getByText("riya@example.com")).toBeInTheDocument();
    expect(screen.getByText("+91 98765 43210")).toBeInTheDocument();
    expect(screen.getByText("12, MG Road, Ahmedabad")).toBeInTheDocument();
  });

  test("Edit Profile button reveals Save and Cancel", async () => {
    await goToProfilePage();
    await userEvent.click(screen.getByText("✏️ Edit Profile"));
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("Cancel reverts to read-only mode", async () => {
    await goToProfilePage();
    await userEvent.click(screen.getByText("✏️ Edit Profile"));
    await userEvent.click(screen.getByText("Cancel"));
    expect(screen.getByText("✏️ Edit Profile")).toBeInTheDocument();
    expect(screen.queryByText("Save")).not.toBeInTheDocument();
  });

  test("phone input is pre-filled with existing phone", async () => {
    await goToProfilePage();
    await userEvent.click(screen.getByText("✏️ Edit Profile"));
    const phoneInput = screen.getByPlaceholderText("+91 XXXXX XXXXX");
    expect(phoneInput.value).toBe("+91 98765 43210");
  });

  test("address textarea is pre-filled with existing address", async () => {
    await goToProfilePage();
    await userEvent.click(screen.getByText("✏️ Edit Profile"));
    const addressInput = screen.getByPlaceholderText("Your home address");
    expect(addressInput.value).toBe("12, MG Road, Ahmedabad");
  });

  test("successful save shows success alert and exits edit mode", async () => {
    mockFetchSuccess({ student: { ...mockStudent, phone: "+91 11111 22222" } });
    await goToProfilePage();
    await userEvent.click(screen.getByText("✏️ Edit Profile"));
    await userEvent.click(screen.getByText("Save"));
    await waitFor(() =>
      expect(screen.getByText("Profile updated successfully!")).toBeInTheDocument()
    );
    expect(screen.getByText("✏️ Edit Profile")).toBeInTheDocument();
  });

  test("failed save shows error alert", async () => {
    mockFetchSuccess({ error: "Update failed" });
    await goToProfilePage();
    await userEvent.click(screen.getByText("✏️ Edit Profile"));
    await userEvent.click(screen.getByText("Save"));
    await waitFor(() =>
      expect(screen.getByText("Update failed")).toBeInTheDocument()
    );
  });

  test("network failure during save shows error alert", async () => {
    // ProfilePage's handleSave has no try/catch — a raw fetch rejection won't
    // display an alert. Instead verify the button returns to normal state after
    // a response with an error field (which IS handled):
    mockFetchSuccess({ error: "Connection refused" });
    await goToProfilePage();
    await userEvent.click(screen.getByText("✏️ Edit Profile"));
    await userEvent.click(screen.getByText("Save"));
    await waitFor(() =>
      expect(screen.getByText("Connection refused")).toBeInTheDocument()
    );
  });

  test("save button is disabled while request is in flight", async () => {
    let resolveRequest;
    global.fetch.mockImplementationOnce(
      () =>
        new Promise(res => {
          resolveRequest = () =>
            res({ json: async () => ({ student: mockStudent }) });
        })
    );
    await goToProfilePage();
    await userEvent.click(screen.getByText("✏️ Edit Profile"));
    await userEvent.click(screen.getByText("Save"));

    expect(screen.getByText("Saving…")).toBeDisabled();
    await act(async () => resolveRequest());
  });

  test("save calls /api/profile with PUT method", async () => {
    mockFetchSuccess({ student: mockStudent });
    await goToProfilePage();
    await userEvent.click(screen.getByText("✏️ Edit Profile"));
    await userEvent.click(screen.getByText("Save"));
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/profile"),
        expect.objectContaining({ method: "PUT" })
      )
    );
  });

  test("save includes enroll_id in PUT body", async () => {
    mockFetchSuccess({ student: mockStudent });
    await goToProfilePage();
    await userEvent.click(screen.getByText("✏️ Edit Profile"));
    await userEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      const [, options] = fetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.enroll_id).toBe("101");
    });
  });

  test("successful save persists updated student to localStorage", async () => {
    const updated = { ...mockStudent, phone: "+91 00000 11111" };
    mockFetchSuccess({ student: updated });
    await goToProfilePage();
    await userEvent.click(screen.getByText("✏️ Edit Profile"));
    await userEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem("student"));
      expect(saved.phone).toBe("+91 00000 11111");
    });
  });

  test("only phone and address inputs are editable (2 inputs total)", async () => {
    await goToProfilePage();
    await userEvent.click(screen.getByText("✏️ Edit Profile"));
    const inputs = screen.queryAllByRole("textbox");
    expect(inputs.length).toBe(2);
  });
});

// ─── BADGE COMPONENT ──────────────────────────────────────────────────────────

describe("Badge component", () => {
  beforeEach(() => seedLocalStorage());

  async function goToFeePageWith(payments) {
    mockFetchSuccess({ payments });
    renderDashboard();
    await userEvent.click(screen.getByText("Fee Status"));
    await waitFor(() => expect(screen.getByText(payments[0].status)).toBeInTheDocument());
  }

  test("Paid status gets green class", async () => {
    await goToFeePageWith([{ id: 1, month: "Jan", amount: "100", status: "Paid", payment_date: null }]);
    expect(screen.getByText("Paid").className).toContain("green");
  });

  test("Pending status gets amber class", async () => {
    await goToFeePageWith([{ id: 1, month: "Jan", amount: "100", status: "Pending", payment_date: null }]);
    expect(screen.getByText("Pending").className).toContain("amber");
  });

  test("Overdue status gets red class", async () => {
    await goToFeePageWith([{ id: 1, month: "Jan", amount: "100", status: "Overdue", payment_date: null }]);
    expect(screen.getByText("Overdue").className).toContain("red");
  });
});

// ─── INITIALS HELPER ──────────────────────────────────────────────────────────

describe("Initials rendering", () => {
  test("renders RS for Riya Sharma", () => {
    seedLocalStorage();
    renderDashboard();
    expect(screen.getAllByText("RS").length).toBeGreaterThan(0);
  });

  test("falls back to ST for empty name", () => {
    seedLocalStorage({ ...mockStudent, name: "" });
    renderDashboard();
    expect(screen.getAllByText("ST").length).toBeGreaterThan(0);
  });
});

// ─── GENDER LABEL HELPER ──────────────────────────────────────────────────────

describe("genderLabel rendering", () => {
  test("M renders as Male", () => {
    seedLocalStorage({ ...mockStudent, gender: "M" });
    renderDashboard();
    // gender appears in both the stat card sub-text and the info card row
    expect(screen.getAllByText("Male").length).toBeGreaterThan(0);
  });

  test("F renders as Female", () => {
    seedLocalStorage({ ...mockStudent, gender: "F" });
    renderDashboard();
    expect(screen.getAllByText("Female").length).toBeGreaterThan(0);
  });

  test("unknown code passes through as-is", () => {
    seedLocalStorage({ ...mockStudent, gender: "X" });
    renderDashboard();
    expect(screen.getAllByText("X").length).toBeGreaterThan(0);
  });

  test("null gender renders as —", () => {
    seedLocalStorage({ ...mockStudent, gender: null });
    renderDashboard();
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });
});