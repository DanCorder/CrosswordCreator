<script lang="ts">
    import Overlay from "./Overlay.svelte";
</script>

<Overlay>
    <span slot="linkText">Credits</span>
    <span slot="content">
        <h2>Credits/Copyright</h2>

        <div class="content-section">
            <h3>This Website</h3>
            <p>This website was created by Dan Corder. <a href="https://github.com/DanCorder/CrosswordCreator/" target="_blank">The source</a> is available under the <a href="https://github.com/DanCorder/CrosswordCreator/blob/main/LICENSE.txt" target="_blank">GPL3 licence</a> on Github so you can run your own version or make customisations.</p>
        </div>

        <div class="content-section">
            <h3>Word List</h3>
            <p>The word list used by this site comes from <a href="http://app.aspell.net/create" target="_blank">http://app.aspell.net/create</a> and has the following notice:</p>
            <pre>
    Copyright 2000-2019 by Kevin Atkinson

    Permission to use, copy, modify, distribute and sell these word
    lists, the associated scripts, the output created from the scripts,
    and its documentation for any purpose is hereby granted without fee,
    provided that the above copyright notice appears in all copies and
    that both that copyright notice and this permission notice appear in
    supporting documentation. Kevin Atkinson makes no representations
    about the suitability of this array for any purpose. It is provided
    "as is" without express or implied warranty.

    Copyright (c) J Ross Beresford 1993-1999. All Rights Reserved.

    The following restriction is placed on the use of this publication:
    if The UK Advanced Cryptics Dictionary is used in a software package
    or redistributed in any form, the copyright notice must be
    prominently displayed and the text of this document must be included
    verbatim.

    There are no other restrictions: I would like to see the list
    distributed as widely as possible.

    Special credit also goes to Alan Beale &lt;biljir@pobox.com&gt; as he has
    given me an incredible amount of feedback and created a number of
    special lists (those found in the Supplement) in order to help improve
    the overall quality of SCOWL.

    Many sources were used in the creation of SCOWL, most of them were in
    the public domain or used indirectly.  For a full list please see the
    SCOWL readme.

    <a href="http://wordlist.aspell.net/" target="_blank">http://wordlist.aspell.net/</a>
            </pre>
        </div>
    </span>
</Overlay>