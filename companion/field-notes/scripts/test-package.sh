#!/usr/bin/env bash

set -euo pipefail

package_path="Packages/FieldNotesCore"
developer_dir="$(xcode-select -p)"

if [[ "$developer_dir" == *CommandLineTools ]]; then
  testing_frameworks="$developer_dir/Library/Developer/Frameworks"
  testing_plugin="$developer_dir/usr/lib/swift/host/plugins/testing/libTestingMacros.dylib"
  testing_libraries="$developer_dir/Library/Developer/usr/lib"

  swift test \
    --package-path "$package_path" \
    -Xswiftc -warnings-as-errors \
    -Xswiftc -F \
    -Xswiftc "$testing_frameworks" \
    -Xswiftc -load-plugin-library \
    -Xswiftc "$testing_plugin" \
    -Xlinker -F \
    -Xlinker "$testing_frameworks" \
    -Xlinker -rpath \
    -Xlinker "$testing_frameworks" \
    -Xlinker -rpath \
    -Xlinker "$testing_libraries" \
    -Xlinker -framework \
    -Xlinker Testing
else
  swift test \
    --package-path "$package_path" \
    -Xswiftc -warnings-as-errors
fi
