#!/bin/bash
#
# Warn by mail when a filesystem fills up.
#
# Runs daily from /etc/cron.d/check-disk-usage.
#
# Sends a message when usage crosses THRESHOLD, then stays quiet until it
# climbs another STEP points. A disk that sits at 82 percent for weeks
# therefore produces one mail, not thirty - and one more if it reaches 87.
# When usage drops back below the threshold, an all-clear is sent once.
#
# The state lives in STATE_DIR, one file per mount point, holding the usage
# at which we last sent a warning.

set -u

THRESHOLD=80
STEP=5
RECIPIENT="Alexander.Loechel@verwaltung.uni-muenchen.de"
STATE_DIR=/var/lib/check-disk-usage
MOUNTPOINTS="/ /boot/efi"

mkdir -p "$STATE_DIR"
host=$(hostname -f)

usage_of() {
    df --output=pcent "$1" 2>/dev/null | tail -1 | tr -dc '0-9'
}

state_file() {
    printf '%s/%s' "$STATE_DIR" "$(printf '%s' "$1" | sed 's|/|_|g;s|^_$|root|')"
}

# The biggest directories, to save whoever reads the mail a first look around.
# Only computed when we actually warn - walking the tree is not free.
big_directories() {
    du -x --max-depth=2 / 2>/dev/null | sort -rn | head -12 | awk '{printf "  %8.1f GB  %s\n", $1/1048576, $2}'
}

for mp in $MOUNTPOINTS; do
    [ -d "$mp" ] || continue

    usage=$(usage_of "$mp")
    [ -n "$usage" ] || continue

    state=$(state_file "$mp")
    last=0
    [ -f "$state" ] && last=$(cat "$state" 2>/dev/null || echo 0)

    if [ "$usage" -lt "$THRESHOLD" ]; then
        # Below the threshold: send an all-clear if we had warned before.
        if [ "$last" -gt 0 ]; then
            {
                printf 'Entwarnung: %s auf %s liegt wieder unter %s%%.\n\n' \
                    "$mp" "$host" "$THRESHOLD"
                printf 'Aktuelle Belegung: %s%%\n\n' "$usage"
                df -h "$mp"
            } | mail -s "[$host] Plattenplatz wieder unkritisch: $mp ($usage%)" "$RECIPIENT"
            rm -f "$state"
        fi
        continue
    fi

    # At or above the threshold. Warn on the first crossing, then only when
    # usage has climbed another STEP points since the last message.
    if [ "$last" -eq 0 ] || [ "$usage" -ge $((last + STEP)) ]; then
        {
            printf 'Der Plattenplatz auf %s wird knapp.\n\n' "$host"
            printf 'Dateisystem %s ist zu %s%% belegt (Schwelle: %s%%).\n\n' \
                "$mp" "$usage" "$THRESHOLD"
            df -h "$mp"
            printf '\n\nGroesste Verzeichnisse:\n\n'
            big_directories
            printf '\n\nHaeufige Ursachen auf diesem Server:\n'
            printf '  - alte Sicherungen unter /opt/Plone/buildout.lakof/backup/\n'
            printf '  - gewachsene Logs unter /srv/Plone/buildout.lakof/lakof/log/\n'
            printf '  - Egg-Caches vergangener Python-Versionen unter /usr/local/buildout-cache/eggs/\n'
            printf '\nNaechste Meldung erst ab %s%% Belegung.\n' "$((usage + STEP))"
        } | mail -s "[$host] Plattenplatz knapp: $mp zu $usage% belegt" "$RECIPIENT"

        printf '%s' "$usage" > "$state"
    fi
done
