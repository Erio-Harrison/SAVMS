import SwiftUI

/// A persistent, draggable bottom panel (not a modal sheet).
/// Drag up/down to snap between open / mid / collapsed states.
public struct BottomPanelView<Content: View>: View {
    private let panelHeight: CGFloat
    private let peek: CGFloat
    private let midFraction: CGFloat
    private let cornerRadius: CGFloat
    private let content: Content

    @State private var offset: CGFloat = 0
    @State private var lastOffset: CGFloat = 0

    /// - Parameters:
    ///   - panelHeight: Max height when fully expanded.
    ///   - peek: How much of the panel stays visible when collapsed.
    ///   - midFraction: Middle snap point as a fraction of panelHeight (0...1).
    ///   - cornerRadius: Corner radius for the panel background.
    ///   - content: Your panel contents.
    public init(
        panelHeight: CGFloat,
        peek: CGFloat = 84,
        midFraction: CGFloat = 0.45,
        cornerRadius: CGFloat = 16,
        @ViewBuilder content: () -> Content
    ) {
        self.panelHeight = panelHeight
        self.peek = peek
        self.midFraction = midFraction
        self.cornerRadius = cornerRadius
        self.content = content()
    }

    public var body: some View {
        let maxOffset = max(panelHeight - peek, 0)     // lowest (collapsed)
        let midOffset = max(panelHeight * midFraction, 0)

        VStack(spacing: 8) {
            // Grabber handle
            Capsule()
                .frame(width: 36, height: 5)
                .foregroundStyle(.secondary)
                .padding(.top, 8)

            content
                .padding(.top, 4)

            Spacer()
        }
        .frame(maxWidth: .infinity)
        .frame(height: panelHeight, alignment: .top)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
        .offset(y: offset)
        .gesture(
            DragGesture()
                .onChanged { value in
                    var newOffset = lastOffset + value.translation.height
                    newOffset = min(max(newOffset, 0), maxOffset) // clamp 0...maxOffset
                    offset = newOffset
                }
                .onEnded { _ in
                    // Snap to nearest detent (open / mid / collapsed)
                    let targets: [CGFloat] = [0, midOffset, maxOffset]
                    offset = targets.min(by: { abs($0 - offset) < abs($1 - offset) }) ?? offset
                    lastOffset = offset
                }
        )
        .animation(.interactiveSpring(), value: offset)
        .onAppear {
            // Start collapsed but visible
            offset = maxOffset
            lastOffset = maxOffset
        }
        .ignoresSafeArea(edges: .bottom) // slide over the home indicator
    }
}
