// A mixiner to mix relative <pre/>
class Mixiner {
    // For array of <pre/>
    elsMixin(els) {
        let index = 0;

        while (index < els.length) {
            this.mixin(els, els[index], index + 1);
            index = index + 1;
        }
    }

    // For each <pre/>
    mixin(els, curEl, nextIndex) {
        // Out of bound
        if (nextIndex >= els.length) {
            return;
        }
        // Not continuous
        if (curEl.nextElementSibling !== els[nextIndex]) {
            return;
        }

        // Recursion
        this.mixin(els, els[nextIndex], nextIndex + 1);

        // Mixin (Start from the last second one)
        curEl.innerText += "\n\n" + els[nextIndex].innerText;

        // Remove the next element
        els[nextIndex].remove();
        els.splice(nextIndex, 1);
    }
}

