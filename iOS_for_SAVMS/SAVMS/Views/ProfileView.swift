//
//  FileView.swift
//  SAVMS
//
//  Created by Renken G on 19/8/2025.
//
//
//  ProfileView.swift
//  SAVMS
//

import SwiftUI

struct ProfileView: View {
    @ObservedObject private var session = AuthSession.shared
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationView {
            Group {
                if let u = session.currentUser {
                    VStack(spacing: 16) {
                        // Header card
                        ProfileHeader(username: u.username, email: u.email, role: u.role)

                        // Info list
                        VStack(spacing: 10) {
                            ProfileRow(icon: "number", title: "User ID", value: u.id)
                            ProfileRow(icon: "person.fill", title: "Username", value: u.username)
                            ProfileRow(icon: "envelope.fill", title: "Email", value: u.email)
                            ProfileRow(icon: "person.badge.shield.checkmark.fill",
                                       title: "Role",
                                       value: roleText(u.role),
                                       valueTint: roleColor(u.role))
                        }
                        .padding(14)
                        .background(RoundedRectangle(cornerRadius: 14, style: .continuous)
                                        .fill(Color(.secondarySystemBackground)))
                        .overlay(RoundedRectangle(cornerRadius: 14, style: .continuous)
                                    .strokeBorder(Color.black.opacity(0.06)))
                        .padding(.horizontal)

                        Spacer(minLength: 24)
                    }
                } else {
                    // Fallback if not logged in yet
                    VStack(spacing: 12) {
                        Image(systemName: "person.crop.circle.badge.exclamationmark")
                            .font(.system(size: 48))
                            .foregroundStyle(.secondary)
                        Text("Not login")
                            .font(.headline)
                        Text("Please login first to view your profile.")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                    .padding(.top, 48)
                }
            }
            .navigationTitle("Profile")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }

    // MARK: - Helpers
    private func roleText(_ role: Int) -> String {
        switch role {
        case 0: return "Admin"
        case 1: return "Client"
        default: return "Unknown(\(role))"
        }
    }
    private func roleColor(_ role: Int) -> Color {
        switch role {
        case 0: return .purple
        case 1: return .blue
        default: return .gray
        }
    }
}

// MARK: - Subviews

private struct ProfileHeader: View {
    let username: String
    let email: String
    let role: Int

    var body: some View {
        VStack(spacing: 14) {
            ZStack {
                Circle()
                    .fill(LinearGradient(colors: [.blue.opacity(0.25), .purple.opacity(0.25)],
                                         startPoint: .topLeading, endPoint: .bottomTrailing))
                Text(initials(from: username, email: email))
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundStyle(.primary)
            }
            .frame(width: 72, height: 72)
            .overlay(Circle().stroke(Color.black.opacity(0.08)))

            VStack(spacing: 4) {
                Text(username).font(.title3).fontWeight(.semibold)
                Text(email).font(.subheadline).foregroundStyle(.secondary)
            }

            RoleChip(text: role == 0 ? "Admin" : "Client",
                     color: role == 0 ? .purple : .blue)
        }
        .padding(.top, 24)
    }

    private func initials(from name: String, email: String) -> String {
        let source = name.isEmpty ? email : name
        let parts = source.split(separator: " ")
        let first = parts.first?.prefix(1) ?? source.prefix(1)
        let last = parts.dropFirst().first?.prefix(1) ?? ""
        return (first + last).uppercased()
    }
}

private struct RoleChip: View {
    let text: String
    let color: Color
    var body: some View {
        HStack(spacing: 6) {
            Circle().fill(color).frame(width: 6, height: 6)
            Text(text).bold()
        }
        .font(.caption)
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(Capsule().fill(color.opacity(0.12)))
        .overlay(Capsule().stroke(color.opacity(0.25)))
        .foregroundStyle(color)
    }
}

private struct ProfileRow: View {
    let icon: String
    let title: String
    let value: String
    var valueTint: Color? = nil

    var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: 12) {
            Image(systemName: icon)
                .frame(width: 24)
                .foregroundStyle(.secondary)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text(value)
                    .font(.body)
                    .fontWeight(.medium)
                    .foregroundStyle(valueTint ?? Color.primary)
                    .textSelection(.enabled) // allow copy
            }
            Spacer()
            // Quick copy button
            Button {
                UIPasteboard.general.string = value
            } label: {
                Image(systemName: "doc.on.doc")
                    .foregroundStyle(.secondary)
            }
            .buttonStyle(.plain)
            .accessibilityLabel("COPY \(title)")
        }
        .padding(12)
        .background(RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .fill(Color(.tertiarySystemBackground)))
        .overlay(RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .strokeBorder(Color.black.opacity(0.04)))
    }
}
